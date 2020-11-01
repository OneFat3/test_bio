// Импортируем другие js-файлы
const searchUrl = "./json/id.json";
const container = document.getElementById("dataWrapper");
const filters = document.getElementById("filters");
const tableData = document.getElementById("tableData");
const searchDevice = document.getElementById("searchDevice");
const unitInfo = document.getElementById("unitInfo");
const deviceInfo = document.getElementById("deviceInfo");
const reportURL = "./json/report.json";

const searchIndex = (units, search) => {
  if (units.findIndex((s) => s.serial === search) >= 0) {
    return units.findIndex((s) => s.serial === search);
  } else if (units.findIndex((g) => g.guid === search) >= 0) {
    return units.findIndex((g) => g.guid === search);
  } else if (units.findIndex((b) => b.bims === search) >= 0) {
    return units.findIndex((b) => b.bims === search);
  }
};

const createInfo = (unit) => {
  unitInfo.innerHTML = `
          <div class="col-2">
            <img class="unitImg" src=${unit.img} alt="" />

          </div>
          <div class="col-10">
            <h1>${unit.name}</h1>

          </div>
  `;
  deviceInfo.innerHTML = `
    <div><span>Тип оборудования: </span> ${unit.type}</div>
    <div><span>Статус: </span> ${unit.status}</div>
    <div><span>Изготовитель: </span> ${unit.producer}</div>
    <div><span>Модель: </span> ${unit.model}</div>
    <div><span>Ответственное подразделение (ремонт): </span> ${unit.repair}</div>
    <div><span>Эксплуатирующее подразделение: </span> ${unit.operating}</div>
    <div><span>МОЛ: </span> ${unit.mol}</div>
    <div><span>Территория: </span> ${unit.territory}</div>
    <div><span>Серийный номер: </span> ${unit.serial}</div>
    <div><span class="IDs">GUID: </span> ${unit.guid}</div>
    <div><span class="IDs">Bims: </span> ${unit.bims}</div>
    <div><span class="IDs">Tam: </span> ${unit.tam}</div>
  `;
};

const createReport = (data, filter) => {
  tableData.innerHTML = createTable(filter);
  if (filter == null) {
    tableData.innerHTML = createTable("choose");
  } else if ("items" in data[filter]) {
    data[filter].items.forEach((item) => {
      tableBody.innerHTML += createTableRows(item, filter);
    });
  } else {
    tableData.innerHTML = createTable("noData");
  }
};

const createTable = (filter) => {
  switch (filter) {
    case "calibration":
      return `
          <div class="tableHeader">
                  <h2>Сalibration report</h2>
              </div>
              <table class="table">
                  <thead>
                      <tr>
                          <th class="thead">Data</th>
                          <th class="thead solutions">Used buffer solutions</th>
                          <th class="thead">Slope, %
                              Norm
                              95-105</th>
                          <th class="thead">Offset, mV
                              Norm
                              ±(0-20)</th>
                          <th class="thead">User</th>
                      </tr>
                  </thead>
                  <tbody id="tableBody">
                      <tr></tr>
                  </tbody>
              </table>
  `;
    case "measuring":
      return `
      <div class="tableHeader">
                  <h2>Measuring report</h2>
              </div>
              <table class="table">
                  <thead>
                      <tr>
                          <th class="thead">Data</th>
                          <th class="thead">???</th>
                          <th class="thead">???</th>
                          <th class="thead">???</th>
                          <th class="thead">User</th>
                      </tr>
                  </thead>
                  <tbody id="tableBody">
                      <tr></tr>
                  </tbody>
              </table>
  `;
    case "using":
      return `
      <div class="tableHeader">
                  <h2>Using report</h2>
              </div>
              <table class="table">
                  <thead>
                      <tr>
                          <th class="thead">Data</th>
                          <th class="thead">???</th>
                          <th class="thead">???</th>
                          <th class="thead">???</th>
                          <th class="thead">User</th>
                      </tr>
                  </thead>
                  <tbody id="tableBody" class="tableBody">
                      <tr></tr>
                  </tbody>
              </table>
  `;
    case "noData":
      return `
      <div class="tableHeader intro">
                  <h2>Нет данных</h2>
              </div>`;
    case "choose":
      return `
      <div class="tableHeader intro">
                  <h2>Выберите отчёт</h2>
              </div>`;
  }
};

const createTableRows = (data, filter) => {
  const tableBody = document.getElementById("tableBody");
  switch (filter) {
    case "calibration":
      let solutions = [];
      if (data.solutions.length) {
        solutions = data.solutions.reduce((acc, item) => {
          return acc + "<br/>" + item;
        });
      } else {
        solutions = "unknown";
      }
      if (data.slope >= 95 && data.slope <= 105) {
        data.slope += `<img class="checkIcon" src="img/success.svg">`;
      } else data.slope += `<img class="checkIcon" src="img/error.svg">`;
      if (data.offset >= -20 && data.offset <= 20) {
        data.offset += `<img class="checkIcon" src="img/success.svg">`;
      } else data.offset += `<img class="checkIcon" src="img/error.svg">`;
      return `
    <tr>
      <td>${data.date}</td>
      <td>${solutions}</td>
      <td>${data.slope}</td>
      <td>${data.offset}</td>
      <td>${data.user}</td>
    </tr>
  `;
    case "measuring":
      break;
    case "using":
      break;
  }
};

filters.addEventListener("submit", function (e) {
  e.preventDefault();
  let formData = new FormData(this);
  const filter = formData.get("workFilter");
  fetch(reportURL)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        createReport(data, filter);
      }
    });
});

searchDevice.addEventListener("submit", function (e) {
  e.preventDefault();
  let formData = new FormData(this);
  const search = formData.get("search");
  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      if ("units" in data) {
        let unit = data.units[searchIndex(data.units, search)];
        if (unit) {
          createInfo(unit);
        } else createModal(meassage);
      }
    });
});