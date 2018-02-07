# retry-function-promise

## get module

```
var retryFunctionPromise = require("retry-function-promise")
```
## parameters to retryFunctionPromise()

* #1 - how many times to retry 
* #2 - how much time to wait between retries
* #3 - function you want to execute or Array [this, function] if nested/inner e.g. A.B.C() -> [A.B, A.B.C()];
* #4 - arguments to pass to function you want to execute number of times

## Simple function example
```
var cnt = 0;
//function you wish to repeat until it doesnt throw error
function regularFunction(arg1, arg2){
    cnt++;
    if(cnt==3) return true;
    else throw "Error";
}

retryFunctionPromise(5, 500, regularFunction, ["firstArgument",{second:"argument"}])
    .then((success)=>{
        console.log("Function completed execution without any errors");
    })
    .catch((error)=>{
        console.error("All tries were unsuccesfull: " + error);
    })
```
## Also works with promises

```
var cnt = 0;
function promiseFunction(arg1, arg2){
    return new Promise((resolve, reject)=>{
        cnt++;
        if(cnt==3) return true;
        else reject("Error");

    })
    
}

retryFunctionPromise(5, 500, promiseFunction, ["firstArgument",{second:"argument"}])
    .then((success)=>{
        console.log("Function completed execution without any errors");
    })
    .catch((error)=>{
        console.error("All tries were unsuccesfull: " + error);
    })

```
## Nested functions

```
var cnt = 0;
first = {
    second:{
        third: function (){
            cnt++;
            if(cnt==4) return true;
            else throw "ERROR";
        }
    }
};
//first.second acts as "this", when calling -> first.second.third.call(first.second, arguments);
retryFunctionPromise(5, 500, [first.second, first.second.third], [])
    .then((success)=>{
        console.log("Function completed execution without any errors");
    })
    .catch((error)=>{
        console.error("All tries were unsuccesfull: " + error);
    })
```