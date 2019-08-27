window.QUnit = {
    config: {
        altertitle: false,
    },
    onError: () => { }
};

unit = {};
unit.visable = false;
unit.toggle = () => {
    if (!unit.visable) {
        $("#qunit").removeClass("hide");
        unit.visable = !unit.visable;
        $("#qunit").toggleClass("show");
    } else {
        $("#qunit").toggleClass("show");
    }
};
unit.assertEqual = (group, name, callback) => {
    if (unit.Assers.filter(x => x.name == name && x.group == group).length != 0) {
        name += new Date().getTime().toString().slice(9);
        unit.Assers.push({ group, name: name });
    }

    unit.Assers.push({ group, name: name });

    QUnit.module(group);
    QUnit.test(name, (assertUnit) => {
        var complete = assertUnit.async(1);
        callback((actual, expected, message) => {
            assertUnit.equal(actual, expected, message);
            complete();
        });
    });
};
unit.assertEqualSimple = (group, name, actual, expected, message) => {
    if (unit.Assers.filter(x => x.name == name && x.group == group).length != 0) {
        name += new Date().getTime().toString().slice(9);
    }
    unit.Assers.push({ group, name: name });

    QUnit.module(group);
    QUnit.test(name, (assertUnit) => {
        assertUnit.equal(actual, expected, message);
    });
};
unit.Assers = [];
unit.assert = (name, group = "Master") => {
    return {
        equal: (actual, expected, message) => {
            if (typeof actual == "function") {
                unit.assertEqual(group, name, actual);
            } else {
                unit.assertEqualSimple(group, name, actual, expected, message);
            }
        },
        equalNot: (actual, expected, message) => {
            console.log(typeof actual);
            if (typeof actual == "function") {
                unit.assertEqual(group, name, actual);
            } else {
                unit.assertEqualSimple(group, name, actual, expected, message);
            }
        }

    };
}
console.log("Loaded QUnit");


