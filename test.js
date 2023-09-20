class MyClass {
    runMyTest = ()=>{
        this.myTest();  
    }
   
    runMyTest2 = function(){
        this.myTest(); 
    }

    myTest() {
        console.log('it works');
    }
}
   
var myClass = new MyClass();
myClass.runMyTest();
myClass.runMyTest2();