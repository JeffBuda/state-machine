export class StateMachine {
    private myProperty: string;
  
    constructor(property: string) {
      this.myProperty = property;
    }
  
    public myMethod() {
      console.log(`My property is: ${this.myProperty}`);
    }
  }