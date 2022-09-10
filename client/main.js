class Demand {
    constructor(root, title) {
        this.root = root;
        this.selected = sessionStorage.getItem("demand-selected");
        this.endpoint = "http://localhost:3000/waitlist";

        var d = new Date();
        var dateMsg = "Today is " + formatDate(d) + "."

        this.root.insertAdjacentHTML("afterbegin", `
            <div class="demand__title">${ title }</div>
            <div class="demand__title">${ dateMsg }</div>
        `);

        this._refresh();
    }

    async _refresh() {
        
        try {
        const response = await fetch(this.endpoint);
        const data =  await response.json();
        
        this.root.querySelectorAll(".demand__option").forEach(option => {
            option.remove();
        });  
        
        buildWaitlistHeader();
        populateWaitlist(data.entries);
        
        } catch(err) {
            alert("ERROR: " + err.message);
        }    
    }
}

const d = new Demand(
    document.querySelector(".demand"),
    "Welcome, J.Covert"
);

function populateDemandlist(obj) {

}

function buildWaitlistHeader() {
    const wl = document.getElementById('storageWaitlist');
    wl.innerHTML = `
        <tr>
            <th scope="col">Date Added</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Email</th>
            <th scope="col">Storage/Parking</th>
            <th scope="col">Unit Type</th>
            <th scope="col">Demand Type</th>
            <th scope="col">Need By Date</th>
            <th scope="col">Added By</th>
        </tr>
    `
}

// populates waitlist
function populateWaitlist(waitlist) {

    var table = document.getElementById("storageWaitlist");

    for(const customer of waitlist) {
        var row = table.insertRow();    
        populateWaitlistRow(row, customer)
    }
}

function populateWaitlistRow(row, data) {
    let cell = row.insertCell();
    cell.innerHTML = data.dateAdded;
    cell = row.insertCell();
    cell.innerHTML = data.customerName;
    cell = row.insertCell();
    cell.innerHTML = data.phoneNumber;
    cell = row.insertCell();
    cell.innerHTML = data.email;
    cell = row.insertCell();
    cell.innerHTML = data.storageOrParking;
    cell = row.insertCell();
    cell.innerHTML = data.unit;
    cell = row.insertCell();
    cell.innerHTML = data.demandType;
    cell = row.insertCell();
    cell.innerHTML = data.needByDate;
    cell = row.insertCell();
    cell.innerHTML = data.addedBy;
}

function openForm() {
    document.getElementById("addForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("addForm").style.display = "none";
    clearAddFormFields();
}

function clearAddFormFields() {
    document.getElementById("customerName").value = "";
    document.getElementById("demandSelect").value = "call";
    document.getElementById("customerPhoneNumber").value = "";
    document.getElementById("customerEmail").value = "";
}

function addRowWaitlist() {
    var table = document.getElementById("storageWaitlist");
    var row = table.insertRow();    
    var cell = row.insertCell();
    const d = new Date()
    cell.innerHTML = formatDate(d);
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("customerName").value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("customerPhoneNumber").value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("customerEmail").value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById('ddl').value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById('ddl2').value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById('demandSelect').value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("needByDate").value;
    cell = row.insertCell();
    cell.innerHTML = "J.Covert";
}

function saveToWaitlist() {
    var table = document.getElementById("storageWaitlist");
    var row = table.insertRow();    
    var cell = row.insertCell();
    const d = new Date()
    cell.innerHTML = formatDate(d);
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("customerName").value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("customerPhoneNumber").value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("customerEmail").value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById('ddl').value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById('ddl2').value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById('demandSelect').value;
    cell = row.insertCell();
    cell.innerHTML = document.getElementById("needByDate").value;
    cell = row.insertCell();
    cell.innerHTML = "J.Covert";
}

function formatDate(date) {
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;

    let d = year + "-";
    if(month.toString().length < 2){
        d += "0";
    }
    d += month.toString() + "-";
    if(day.toString().length < 2){
        d += "0";
    }
    d += day.toString();
    return d;
}

function configureDropDownLists(ddl1, ddl2) {
    var parking= ['Please pick a parking size',
                  '10x16c', '10x16u', '10x25c', '10x30c', '10x30u', '10x31c',
                  '11x32c', '10x35u', '10x40c', '10x45c', '10x50c', '10x55c'];
    var storage = ['Please pick a storage size',
                   "5x5g", "5x5u", "7x5u", "7x7u", "10x5g", "10x5u",  "7x12g",  "7x12u",  "10x7g",  "10x7u",
                   "10x7.5u", "10x10g", "10x10u", "10x12g", "10x12u", "10x13u", "10x15g", "10x15u", "10x18g",
                   "10x18u",  "10x20g", "10x20u", "10x20e", "10x25g", "10x30g", "10x30e", "12x38e", "12x43e"];
  
    switch (ddl1.value) {
      case "storage":
        ddl2.options.length = 0;
        for (i = 0; i < storage.length; i++) {
          createOption(ddl2, storage[i], storage[i]);
        }
        break;
      case "parking":
        ddl2.options.length = 0;
        for (i = 0; i < parking.length; i++) {
          createOption(ddl2, parking[i], parking[i]);
        }
        break;
      default:
        ddl2.options.length = 0;
        break;
    }
  
  }
  
  function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
  }

  function message(msg) {
    alert(msg);
  }

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
// document.addEventListener("click", closeAllSelect);
