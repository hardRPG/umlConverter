class Variable {
  constructor(name, type, symbol) {
    this.name = name;
    this.type = type;
    this.symbol = symbol;
  }

  printVariable() {
    return this.symbol + " " + this.name + ":" + this.type;
  }
}

class FunctionClass {
  constructor(symbol, parameters, name, returnType) {
    this.symbol = symbol;
    this.name = name;
    this.parameters = parameters;
    this.returnType = returnType;
  }

  printFunction() {
    let parameters = "";
    for (let i = 0; i < this.parameters.length; i++) {
        if(i == this.parameters.length - 1) {
            parameters += this.parameters[i];
        } else {
            parameters += this.parameters[i] + ", ";
        }
    }
    return this.name + "(" + parameters + "):" + this.returnType;
  }
}

class ClassRectangle {
  constructor(name) {
    this.name = name;
  }

  variables = [];
  functions = [];
  anchor = [];
  x = 0;
  y = 0;
  width = 150;
  height = 100;

  setSize() {
    this.height += variables.length * 10;
  }

  setX(multiplier) {
    this.x = (this.x + this.width + 20) * multiplier;
  }

  addVariables(variables) {
    this.variables = variables;
  }

  setAnchors() {
    this.anchor = [this.x + this.width / 2, this.y + this.width];
  }
}

//______________________________________________________________________________________

const data = document.currentScript.dataset;
const rawCode = data.code;
//___________GLOBALS______

let isInClass = false;
let curlies = 0;
let classes = [];
let variables = [];
let varDict = {};
let functions = [];
let funcDict = {};
let c = document.getElementById("myCanvas");
let pen = c.getContext("2d");

function splitCode(txt) {
  return txt.split("\\r\\n");
}

function cleanCode(txtarray) {
  txtarray[0] = txtarray[0].replace("b'", "");
  txtarray[txtarray.length - 1] = txtarray[txtarray.length - 1].replace("'","");
  for (let i = 0; i < txtarray.length; i++) {
    txtarray[i] = txtarray[i].trim();
  }
  return txtarray.filter(function (e) {
    return e;
  });
}

//___________________________Erkennung_____________________________________________
function detectVariable(codeline) {
  let code = codeline.split("=")[0].trim();
  if (
    code.includes("{") ||
    code.includes("}") ||
    code.includes("(") ||
    code.includes(")")
  ) {
    return false;
  } else {
    return true;
  }
}

function extractVariableInfos(code) {
  const infos = ["-", "", ""];
  let variable = code.split("=")[0].trim().split(" ");
  for (let i = 0; i < variable.length; i++) {
    switch (variable[0]) {
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
  infos[2] = variable[variable.length - 1];
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
    if (code[i] == "{") {
      curlies++;
    }
    if (code[i] == "}") {
      curlies--;
    }
    if (curlies == 0 && isInClass == true) {
      isInClass = false;
      return false;
    }
    if (code[i] == "class") {
      isInClass = true;
      curlies++;
      return true;
    }
  }
  return false;
}

function extractClass(codeline) {
  const infos = ["", false, ""];
  let code = codeline.trim().split(" ");
  for (let i = 0; i < code.length; i++) {
    if (code[i] == "class") {
      infos[0] = code[i + 1];
    }
    if (code.length >= i + 2 && code[i + 2] == "extends") {
      infos[1] = true;
      infos[2] = code[i + 3];
    }
  }
  return infos;
}

function detectFunction(codeline) {
    let code = codeline.split("=")[0].trim().replaceAll(" ","");
    if (curlies == 2 && (code.includes("){") || code.includes(")throwsException{"))) {
        return true;
    }
    return false;
}

function extractFunctionInfo(codeline) {
    const infos = ["-", "", ""];
    let code = codeline.trim().split(" ");
    for (let i = 0; i < code.length; i++) {
      switch (code[0]) {
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
      if(code[i].includes("(")) {
        let namevar = code[i].split("(");
        infos[2] = namevar[0];
        infos[3] = code[i-1];
        }
    }
    let substring = codeline.substring(codeline.indexOf("(") + 1, codeline.lastIndexOf(")"));
    let vars = substring.split(",");
    let args = [];
    for(let v of vars) {
        args.push(v.trim().split(" ")[0]);
    }
    infos[1] = args;
    return infos;
}

//______________________DRAWING______________________

function drawClass(name, width, height, x, y) {
  pen.rect(x, y, width, height);
  pen.rect(x, y, width, 20);
  pen.textAlign = "center";
  pen.fillText(name, x + width / 2, 10);
  pen.textAlign = "start";
  pen.stroke();
}

function drawText(text, x, y, pad) {
  pen.fillText(text, x, y + pad);
}

//________________________________________________

let codeLines = cleanCode(splitCode(rawCode));
let multiplier = 0;

for (let code of codeLines) {

  if (detectClass(code)) {
    infos = extractClass(code);
    classes.push(new ClassRectangle(infos[0]));
  }

  if(detectFunction(code)) {
    funcInfo = extractFunctionInfo(code);
    functions.push(new FunctionClass(funcInfo[0],funcInfo[1],funcInfo[2],funcInfo[3]));
    if(isInClass == true) {
        funcDict[classes[classes.length-1].name] = funcInfo[2];
    }
  }
  

  if (detectVariable(code)) {
    varInfos = extractVariableInfos(code);
    variables.push(new Variable(varInfos[2], varInfos[1], varInfos[0]));
    if(isInClass == true) {
        varDict[classes[classes.length-1].name] = varInfos[0];
    }
  }
}

for (let c of classes) {
  c.setX(multiplier);
  c.addVariables(variables);
  c.setSize();
  c.setAnchors();
  drawClass(c.name, c.width, c.height, c.x, c.y);
  for (let i = 0; i < variables.length; i++) {
        drawText(variables[i].printVariable(), c.x + 5, c.y + 30, 10 * i);
  }
  for (let j = 0; j < functions.length; j++) {
    drawText(functions[j].printFunction(), c.x + 5, c.y + variables.length * 25, 10 * j);
  }
  multiplier++;
}
