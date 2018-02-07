# retry-function-promise

## Get module

```js
var retryFunctionPromise = require("retry-function-promise");
```
## Parameters to retryFunctionPromise(count, interval, function, args)

* #count    - how many times to retry 
* #interval - how much time to wait between retries
* #function - function you want to execute or Array [this, function] if nested/inner e.g. A.B.C() -> [A.B, A.B.C()];
* #args     - arguments to pass to function you want to execute number of times

###### In the future will probably add overloading

## Simple function example
```js
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

```js
var cnt = 0;
function promiseFunction(arg1, arg2){
    return new Promise((resolve, reject)=>{
        cnt++;
        if(cnt==3) resolve();
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

```js
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