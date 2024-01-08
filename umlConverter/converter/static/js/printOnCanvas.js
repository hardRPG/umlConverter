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
  constructor(name) {
    this.name = name;
    //this.pen.fillText("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    //this.drawStart(pen,name);
  }

  variables = [];
  functions = [];
  anchors = [];
  x = 0;
  y = 0;
  width = 100;
  height = 100;

  setSize() {
    this.height += (variables.length) * 10;
  }

  setX(multiplier) {
    this.x = (this.x + this.width + 10) * multiplier;
  }

  addVariables(variables) {
    this.variables = variables;
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
let functions = {};
let c = document.getElementById("myCanvas");
let pen = c.getContext("2d");

function splitCode(txt) {
  return txt.split("\\r\\n");
}

function cleanCode(txtarray) {
  txtarray[0] = txtarray[0].replace("b'", "");
  txtarray[txtarray.length - 1] = txtarray[txtarray.length - 1].replace(
    "'",
    ""
  );
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

//______________________DRAWING______________________

function drawClass(name, width, height, x, y) {
  pen.rect(x, y, width, height);
  pen.rect(x, y, width, 20);
  pen.textAlign = "center";
  pen.fillText(name, x + width/2, 10);
  pen.textAlign = "start";
  pen.stroke();
}

function drawText(text, x, y, pad) {
    pen.fillText(text,x,y+pad);
}

function moveClassRectangle(classes) {

}

//_________________________________________________________

let codeLines = cleanCode(splitCode(rawCode));

let multiplier = 0;

for (let code of codeLines) {
  if (detectVariable(code)) {
    varInfos = extractVariableInfos(code);
    variables.push(new Variable(varInfos[2],varInfos[1], varInfos[0]));
  }
  if (detectClass(code)) {
    infos = extractClass(code);
    classes.push(new ClassRectangle(infos[0]));
  }
}

for (let c of classes) {
    c.setX(multiplier);
    c.addVariables(variables);
    c.setSize();
    console.log(c.height);
    drawClass(c.name, c.width,c.height, c.x, c.y);
    for (let i = 0; i < variables.length; i++) {
        drawText(variables[i].printVariable(),c.x+5,c.y+30,10*i);
    }
    multiplier++;
}

