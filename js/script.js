var fieldListRef = firebase.database().ref("field_list");
var setNewField = fieldListRef.push();

fieldListRef.once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
		var selectElement = document.getElementById("trackingCode").elements.namedItem(childSnapshot.child("field").val());
		var createOption = document.createElement("option");
		createOption.value = childSnapshot.child("value").val();
		createOption.textContent = childSnapshot.child("name").val();
		selectElement.appendChild(createOption);
	});
});

function validateForm(x) {
	clearErrors();
//are all required fields present?
	var a = {status:"Valid", fields:[]};
	for (i = 0; i < x.length; i++) {
		var b = x.elements[i].dataset.needed;
		var c = x.elements[i].value;
		var d = x.elements[i].name;
		if (b == "required" && c == "") {
			a.status = "Invalid";
			a.fields.push({name:d, value:c, status:"Missing Value"});
		} else if (b) {
			a.fields.push({name:d, value:c, status:"Valid"});
		}
	}

//determine if the URL is valid
	if (a.fields[0].status != "Missing Value") {
		var e = a.fields[0].value;	
		var f = document.createElement("a");
		f.href = e;
		if (!f.host) {
			a.status = "Invalid";
			a.fields[0].status = "Invalid URL";
		} else {
			a.fields[0].value = f;
		}
	}

//return input errors or send values for link creation
	if (a.status == "Invalid") {
		displayErrors(a.fields);
	} else {
		var g = {url:"", fields:[]};
		for (j = 0; j < a.fields.length; j++) {
			h = a.fields[j].name;
			l = a.fields[j].value;
			if (h == "url") {
				g.url = l;
			} else if (l != "") {
				g.fields.push([h,l]);
			}
		}
		createLink(g);
	}
}

function createLink(x) {
	var a = x.url.origin;
	var b = [];
	for (z = 0; z < x.fields.length; z++) {
		b.push(x.fields[z].join("="));
	}
	var c = b.join("&");
	
	document.getElementById("outputURL").textContent = a + ((x.url.search != "") ? (x.url.search + "&") : "?") + c + x.url.hash;
}

function displayErrors(x) {
	var a = "";
	c = document.getElementsByName("error");
	for (i = 0; i < x.length; i++) {
		if (x[i].status != "Valid") {
			c[i].textContent=x[i].status;
		}
	}
}

function createCampaignID () {
	return new Date().getTime() + '.' + Math.random().toString(36).substring(5);
}

//Enables or disables utm_term input based on radio button selection
function ppcEnable (x) {
	y = document.getElementById("trackingCode").elements.namedItem("utm_term");
	if (x.checked && x.value == "yes") {
		y.disabled = false;
		y.placeholder = "ex: diabetes";
		y.dataset.needed = "required";
	} else if (x.checked && x.value == "no") {
		y.disabled = true;
		y.placeholder = "";
		y.dataset.needed = "optional";
		y.value = "";
	}			
}

function createNewField() {
	
}

function createMyNewField() {
	var a = document.getElementById("newFieldForm").elements;
	setNewField.set({
		field: a[0].value,
		name: a[1].value,
		value: a[2].value,
		description: a[3].value
	});
}

function clearErrors() {
	var a = document.getElementsByName("error");
	document.getElementById("outputURL").textContent = "";
	for (i = 0; i < a.length; i++) {
		a[i].textContent = "";
	}
	return;
}

function displayDescription(x) {
	for (i=0 ; i < selectOptions.length; i++) {
		if(selectOptions[i].field == x.name && selectOptions[i].value == x.value) {
			document.getElementById("mediumDetail").textContent = selectOptions[i].description;
			break;
		}
	}
}
