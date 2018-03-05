function greeter(person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}
var user = { firstname: "Jane", lastname: "User" };
console.log(greeter(user));
