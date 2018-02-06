/**
 * @param {*} times //how many times you want to repeat this process
 * @param {*} interval //what interval in ms
 * @param {*} func  //function that you want to execute, in some occasions you will need to pass "this" in order for nested function to work,
 * so you can do it like this [this, func]; e.g. if your function is A.B(), pass this param as Array [A, A.B];
 * @param {*} args // arguments to pass to function <Array>
 */
function retry(times, interval, func, args) {
    return new Promise((resolveFinal, rejectFinal) => { //final promise if tries were succesfull or failed
        let localFunc = (count, times, inteval, func, args) => {
            if (typeof func != "function" && func.length == 2) { //check for "this"
                var self = func[0]; //this
                func = func[1] //actual funcion of this
            }
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let currFunc = func.apply(self || this, args); //currFunc eiter a returned value of normal Func or a Promise obj
                        if (Promise.resolve(currFunc) == currFunc) { //if its a promise function
                            currFunc
                                .then(x => {
                                    resolve(x);
                                }).catch(e => {
                                    reject(e);
                                })
                        } else resolve(currFunc); //if its not a promise and it finished without errors it means its time to exit with resolved status
                    } catch (e) {
                        reject(e);
                    }
                }, interval);
            })
                //after check if this try was succesfull  
                .then((x) => {
                    resolveFinal(x || "Function executed succesfully");
                })
                .catch((e) => {
                    if ((count + 1) <= times) {
                        console.log(e);
                        console.log("Retrying " + (count + 1) + "/" + times);
                        func = (Object.keys(self).length > 0) ? [self, func] : func;
                        localFunc(++count, times, interval, func, args);
                    } else rejectFinal(e)
                })
        }; localFunc(0, times, interval, func, args); //first call of localFunc to start repeat process
    });
}

module.exports = retry;