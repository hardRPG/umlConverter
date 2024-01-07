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

//______________________________________________________________________________________


const data = document.currentScript.dataset;
const rawCode = data.code;
//___________GLOBALS______

let isInClass = false;
let curlies = 0;


function splitCode(txt) {
    return txt.split("\\r\\n");
}

function cleanCode(txtarray) {
    txtarray[0] = txtarray[0].replace("b'","");
    txtarray[txtarray.length-1] = txtarray[txtarray.length-1].replace("'","");
    for(let i = 0; i < txtarray.length; i++) {
        txtarray[i] = txtarray[i].trim();
    }
    return txtarray.filter(function(e){return e}); 
}

//___________________________Erkennung_____________________________________________
function detectVariable(codeline) {
    let code = codeline.split("=")[0].trim().split(" ");
    if (code.includes("{") || code.includes("}") || 
        code.includes("(") || code.includes(")")) {
        return false;
    } else {
        return true;
    }
}

function extractVariableInfos(code) {
    const infos = ["-", "", ""];
    let variable = code.split("=")[0].trim().split(" ");
    for (let i = 0; i < variable.length; i++) {
        switch(variable[0]) {
            case "public":
                infos[0] = "+";
                break;
            case "private":
                infos[0] = "-";
                break;
            case "protected":
                infos[0] = "#";
                break;
        }
    }
    infos[2] = variable[variable.length-1];
    if (variable.length == 2) {
        infos[1] = variable[0];
    } else {
        infos[1] = variable[1];
    }
    return infos;
}



function detectClass(codeline) {
    let code = codeline.trim().split(" ");
    for (let i = 0; i < code.length; i++) {
        if(code[i] == "{") {
            curlies++;
        }
        if(code[i] == "}") {
            curlies--;
        }
        if(curlies == 0 && isInClass == true) {
            isInClass = false;
            return false;
        }
        if(code[i] == "class") {
            isInClass = true;
            console.log("DETECTED");
            return true;
        }
    }
    return false;
}

function extractClass(codeline) {
    const infos = ["", false, ""];
    let code = codeline.trim().split(" ");
    console.log(code);
    for (let i = 0; i < code.length; i++) {
        if(code[i] == "class") {
            infos[0] = code[i+1];
            console.log(code[i+1]);
        }
        if(code.length >= i+2 && code[i+2] == "extends") {
            infos[1] = true;
            infos[2] = code[i+3];
        }
    }
    return infos;
}

//________________________________________________

let codeLines = cleanCode(splitCode(rawCode));



for(let code of codeLines) {
    if (detectClass(code)) {
        console.log(extractClass(code));
    }
    
}




