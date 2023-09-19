// Fake TypeScript code
class FakePerson {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): void {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const fakePerson1 = new FakePerson("John", 30);
fakePerson1.greet();

const fakePerson2 = new FakePerson("Alice", 25);
fakePerson2.greet();

function fakeSum(a: number, b: number): number {
  return a + b;
}

const result = fakeSum(10, 5);
console.log(`The sum of 10 and 5 is ${result}.`);

interface FakeProduct {
  name: string;
  price: number;
}

const fakeProducts: FakeProduct[] = [
  { name: "Widget A", price: 20.99 },
  { name: "Gadget B", price: 15.49 },
  { name: "Thingamajig C", price: 30.0 },
];

for (const product of fakeProducts) {
  console.log(`Product: ${product.name}, Price: $${product.price}`);
}
