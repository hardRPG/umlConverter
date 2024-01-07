class Variable {
  constructor(name, type, symbol) {
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
    this.height += (functions.length + variables.length) * 30;
  }
}

//______________________________________________________________________________________

const data = document.currentScript.dataset;
const rawCode = data.code;
//___________GLOBALS______

let isInClass = false;
let curlies = 0;
let classes = [];
let variables = {};
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
  let code = codeline.split("=")[0].trim().split(" ");
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

function drawStart(name) {
  pen.rect(1, 1, 200, 200);
  pen.rect(0, 0, 100, 20);
  pen.fillText(name, 30, 70);
  pen.stroke();
}

//_________________________________________________________

let codeLines = cleanCode(splitCode(rawCode));

for (let code of codeLines) {
  if (detectVariable(code)) {
    varInfos = extractVariableInfos(code);
    variables.push(new Variable(varInfos[0]))
  }
  if (detectClass(code)) {
    infos = extractClass(code);
    classes.push(new ClassRectangle(infos[0]));
  }
}

for (let c of classes) {
  console.log(c);
  drawStart(c.name);
}
