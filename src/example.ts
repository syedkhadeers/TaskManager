// Incorrect - code outside valid scope
let name = "John"
if  // Missing parentheses and block
console.log("Hello")

// Fixed version
let name = "John";
if (name === "John") {
    console.log("Hello");
}
