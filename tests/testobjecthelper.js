ObjectHelper = require('../shared/objecthelper').ObjectHelper;

function TestObject1() {
    this.a = "abc";
    this.b = "bcd";
    this.func = function() {
             return "Bla";
         }
}

function TestObject2() {
    this.a = "kja";
    this.b = "kjo";
    this.c = "tata";
    this.d = {
        x: "test",
        y: "abc"
    }

    this.func = function() {
             return "Blabla";
         }
}

function testObjectHelper() {
    console.log("== Test ObjectHelper ==");
    var object1 = new TestObject1();
    var object2 = new TestObject2();

    assert.notEqual(object1.a, object2.a);
    assert.notEqual(object1.b, object2.b);
    assert.notEqual(object1.c, object2.c);

    ObjectHelper.copyDataToObject(object2, object1, ["a", "b", "c", "d"]);

    assert.equal(object1.a, object2.a);
    assert.equal(object1.b, object2.b);
    assert.equal(object1.c, object2.c);
    assert.deepEqual(object1.d, object2.d);

    assert.equal(object1.func(), "Bla");
    assert.equal(object2.func(), "Blabla");

    console.log("OK");
}

testObjectHelper();
