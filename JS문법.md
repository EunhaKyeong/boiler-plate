## var, let, const 차이점
1. `var`는 `function-scoped`이고 `let, const`는 `block-scoped`이다.
    ```javascript
    for (var i=0; i<10; i++) {
        console.log(i);
    }
    console.log(i); //10

    function loop() {
        for (var j=0; j<10; j++) {
            console.log(j);
        }
    }

    loop();
    console.log(j); //Uncaught ReferenceError: j is not defined
    ```
    `var`은 `function-scoped`이기 때문에 for문이 종료된 후엔 변수 i가 살아 있지만 함수 loop()가 종료된 후 j는 에러가 발생한다.

    ```javascript
    for (let i=0; i<10; i++) {
        console.log(i);
    }
    console.log(i); //Uncaught ReferenceError: i is not defined

    function loop() {
        for (let k=0; k<10; k++) {
            console.log(k);
        }
    }
    loop();
    console.log(k); //Uncaught ReferenceError: k is not defined
    ```
    `let`과 `const`는 `block-scoped`이기 때문에 for문 종료후, 함수 종료 후 모두 error가 발생한다.

2. `var`은 `재선언이 가능`하지만 `let`과 `const`는 `재선언이 불가능`하다.
    ```javascript
    var a = 'a1';
    var a = 'a2';
    console.log(a); //a2 출력

    let b = 'b1';
    let b = 'b2';   //Uncaught SyntaxError: Identifier 'b' has already been declared
    ```
    - `var`의 경우 `재선언이 가능`하기 때문에 a2가 출력되는 것을 확인할 수 있다.  
    - 하지만 `let`과 `const`의 경우 `재선언이 불가능`하기 때문에 이미 b1으로 정의된 b 변수를 b2로 재정의하는 순간 이미 선언된 변수라며 에러가 발생하는 것을 확인할 수 있다.  
3. `let`은 `재할당이 가능`하고 `초깃값이 없어도 된다.`하지만 `const`는 `재할당이 불가능`하고 `변수 선언 시 초깃값이 반드시 존재해야 한다`.
    ```javascript
    let c;  //let은 초깃값을 설정하지 않아도 된다.
    c = 1;  
    console.log(c); //1 출력

    const d;    //error! const는 선언하는 순간 초깃값도 할당해야 한다.
    const e = 4;    //const는 반드시 선언 시 할당도 함께!
    console.log(e); //4 출력
    ```
