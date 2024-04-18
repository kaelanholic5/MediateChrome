/*
Created by: Kaelan Holic
Owned By: Media/te Web Works LLC.
*/

function handleUrl(url) {
	let website = null;
	let urlEnd1 = "https://api.mediateplugin.org/getAllWebsites";
	var req1 = new XMLHttpRequest();
	req1.responseType = 'json';
	req1.open('GET', urlEnd1, true);
	req1.onload = function () {
		var jsonResponse = req1.response;
		for (let i = 0; i < jsonResponse.length; i++) {
			if (url.includes(jsonResponse[i].url)) {
				website = jsonResponse[i];
				break;
			}
		}
		popuplateWithWebsite(website);
	};
	req1.send(null);
}

function popuplateWithWebsite(website) {
	if (website != null) {
		if (website.companyId != null) {
			addCompanies(website.companyId);
		}
	} else {
		displayHelpPage();
	}
}

function addPersonOwner(id) {
	let url = "https://api.mediateplugin.org/getPersonById?id="
		+ id;

	var req = new XMLHttpRequest();
	req.responseType = 'json';
	req.open('GET', url, true);
	req.onload = function () {
		var jsonResponse = req.response;
		addPersonOwnerToHtml(jsonResponse);
	};
	req.send(null);
}

function addCompanies(id) {
	let url = "https://api.mediateplugin.org/getAllCompaniesByDirectOwnerId?companyId="
		+ id;
	var req = new XMLHttpRequest();
	req.responseType = 'json';
	req.open('GET', url, true);
	req.onload = function () {
		var jsonResponse = req.response;
		jsonResponse.forEach(element => {
			addMainCompanyToHtml(element);
		});
	}
	req.send(null);
}

function addMainCompanyToHtml(mainCompany) {
	var mainSection = document.getElementById('compSection');

	var ownerDiv = document.createElement('div');
	ownerDiv.setAttribute('class', 'mainCompany');

	var peopleHeader = document.createElement('h3');
	peopleHeader.setAttribute('class', 'directOwnerName');
	peopleHeader.textContent = mainCompany.name;

	var topDogList = document.createElement('div');

	ownerDiv.appendChild(peopleHeader);
	ownerDiv.appendChild(topDogList);
	mainSection.appendChild(ownerDiv);


	if (mainCompany.mainPeople.length > 0) {
		mainCompany.mainPeople.forEach(person => {
			var personName = document.createElement('div');
			personName.setAttribute('class', 'personName');
			personName.textContent = person.name;

			var personAssociations = document.createElement('div');
			personAssociations.setAttribute('class', 'personAssociations');

			if (person.otherCompanies.length > 0 || person.description != null) {
				personAssociations.textContent = "(";
			}
			if (person.otherCompanies.length > 0) {
				person.otherCompanies.forEach(compName => {
					personAssociations.textContent += compName + ", ";
				});

				if (person.description == null) {
					personAssociations.textContent = personAssociations.textContent.slice(0, personAssociations.textContent.length - 2);
				}
			}
			if (person.description != null) {
				personAssociations.textContent += person.description;
			}
			if (person.otherCompanies.length > 0 || person.description != null) {
				personAssociations.textContent += ")";
			}
			var personRelationship = document.createElement('div');
			personRelationship.setAttribute('class', 'personRelationship');
			personRelationship.textContent = person.relationship;

			topDogList.appendChild(personName);
			topDogList.appendChild(personRelationship);
			topDogList.appendChild(personAssociations);
		});
	} if (mainCompany.partialOwners.length > 0) {
		mainCompany.partialOwners.forEach(partialOwner => {
			var ownerName = document.createElement('div');
			ownerName.setAttribute('class', 'partialOwnerName');
			ownerName.textContent = partialOwner.name;

			var ownerRelationship = document.createElement('div');
			ownerRelationship.setAttribute('class', 'partialOwnerRelationship');
			ownerRelationship.textContent = partialOwner.relationship;

			topDogList.appendChild(ownerName);
			topDogList.appendChild(ownerRelationship);
		});
	}

	if (mainCompany.partialOwners.length <= 0 && mainCompany.mainPeople.length <= 0) {
		var a = document.createElement('a');
		var linkText = document.createTextNode("No information. Can you help us out?");
		a.setAttribute('class', 'noWebInfo');
		a.appendChild(linkText);
		a.href = "https://www.mediateplugin.org/donate/";
		topDogList.appendChild(a);
	}

	var locationHeader = document.createElement('h4');
	locationHeader.setAttribute('class', 'locationHeader');
	locationHeader.textContent = mainCompany.location;
	ownerDiv.appendChild(locationHeader);

	var main = document.getElementById('mainSection');
	main.style.display = 'block';
}

function displayHelpPage() {
	var mainSection = document.getElementById('noData');
	mainSection.style.display = 'block';
}

chrome.tabs.query({
	active: true,
	lastFocusedWindow: true
}, function (array_of_Tabs) {
	var tab = array_of_Tabs[0];
	handleUrl(tab.url);
});

window.addEventListener('click', function (e) {
	if (e.target.href !== undefined) {
		chrome.tabs.create({ url: e.target.href })
	}
});