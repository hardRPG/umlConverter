class Variable {
    constructor(name, type, visibility, symbol) {
        this.name = name;
        this.type = type;
        this.visibility = visibility;
        this.symbol = symbol;
    }

    printVariable() {
        return this.symbol + " " + this.name + ":" + this.type;
    }
}

class Function {
    constructor(name, parameters, returnType) {
        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
    }

    printFunction() {
        let parameters = "";
        for (let i = 0; i < this.parameters.length(); i++) {
            parameters += this.parameters[i].printVariable() + ", "; 
        }
        return this.name + "(" + parameters + "):" + this.returnType; 
    }
}

class ClassRectangle {
    constructor(name, variables, functions) {
        this.name = name;
        this.variables = variables;
    }
    x = 0;
    y = 0;
    width = 100;
    height = 100;
}