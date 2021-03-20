1. `const`
- 상수로 선언.
- 처음 선언 시 무조건 초기값을 저장해야 한다.
    ```javascript
    //incorrect
    const test;
    test = 10;  //error!

    //correct
    const test = 10;
    ```
- 초깃값을 저장한 후에는 값을 변경할 수 없다.
    ```javascript
    const test = 10;
    test = 20;  //error!
    ```