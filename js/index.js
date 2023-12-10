function sendPasswordOnClick(btn){
    setRules(btn); 
    var passwordInput = document.getElementById("password-input");
    testingPasswords(passwordInput.value); 
}

// Highlights password on page 2 in "select password" table.
function selectPassword(row) {
    const previousSelection = document.querySelector("tr.selected");
    if (previousSelection) {
        previousSelection.classList.remove("selected");
    }
    row.classList.add("selected");
    var page2password = row.children[1].innerText; // This is the password we will be checking.
    testingPasswords(page2password);
}

function sendPasswordOnClickP2(btn) {
    setRules(btn); 
    let page2password = document.querySelectorAll(".selected"); 
    testingPasswords(page2password[0].children[1].innerText);
} 

function sendPasswordOnInput(password) {
    let pswrd = password.target.value;
    testingPasswords(pswrd);
}

function testingPasswords(pswrd) {    
    let array = document.querySelectorAll(".btn-selected");
    let current_id = "";
    for(let i = 0; i < array.length; i++){
        current_id = array[i].children[1].children[0].id;
        let group = getCurrentRules(groups, current_id);
        let n = array[i].id.slice(-1);
        for(let j = 0; j < group.rules.length; j++) {
            let p = document.getElementById("p-rule-" + n + "-" + j);
            let decision = group.rules[j].decide(pswrd);
            
            // Do not decide inactive rules.
            if(!group.rules[j].checkActive(pswrd)) {
                p.classList.remove("invalid");
                p.classList.remove("valid");
                p.classList.remove("nondeterministic");
                p.classList.add("inactive");
                continue;
            }

            // Do not decide nondeterministic rules.
            if(!group.rules[j].deterministic) {
                p.classList.remove("invalid");
                p.classList.remove("valid");
                p.classList.remove("inactive");
                p.classList.add("nondeterministic");
                continue;
            }

            if(decision == true) {
                p.classList.remove("inactive");
                p.classList.remove("nondeterministic");
                p.classList.remove("invalid");
                p.classList.add("valid");
            } else {
                p.classList.remove("inactive");
                p.classList.remove("nondeterministic");
                p.classList.remove("valid");
                p.classList.add("invalid");
            }
        }
    }
}

function loadInput() {
    // Load get live password input.
    var passwordInput = document.getElementById("password-input");
    passwordInput.addEventListener("input", sendPasswordOnInput);
}

// On the website loading up, load json rules and display in button dropdowns.
function loadRules() {
    // Get list of buttons inside of rightside button container.
    let buttons = document.querySelectorAll("div.button-container button");
    let data = groups;
    // Loop through dropdown items and update with new rules.
    // From json, match groupID to dd-[i]].
    for(let i = 0; i < buttons.length; i++ ) {
        let content = document.getElementById(groups[i].groupId).parentElement;
        let group = parseGroup(data[i]);
        let item = document.createElement("li");
        item.setAttribute("id", "dd-rules-"+i);

        for(let i = 0; i < group.rules.length; i++) {
            item.innerHTML+= "- " + group.rules[i].displayName + "<br />";
        }
        content.appendChild(item);
    }
}

function loadCommonPasswords() {
    // Load in passwords to page 2 table.
    let p = passwords;
    let table = document.getElementById("page2-table");

    for(let i = 0; i < 200; i++) {
        let item = document.createElement("tr");
        item.setAttribute("id", "p-" + (i + 1));
        item.addEventListener("click", function () {
            selectPassword(this)
        });

        let col1 = document.createElement("td");
        col1.innerText = p[0].rank[i];
        let col2 = document.createElement("td");
        col2.innerText = p[0].password[i];
        let col3 = document.createElement("td");
        col3.innerText = p[0].users[i];

        item.appendChild(col1);
        item.appendChild(col2);
        item.appendChild(col3);
        table.appendChild(item);
    }
}

function loadPageOne() {
    loadRules();
    loadInput();
}

function loadPageTwo() {
    loadRules();
    loadCommonPasswords();
}

// When school button clicked, load rules wherever they need to go to be applied to password.
// This includes checklist display (bottom of page)
function setRules(btn) {
    let table = document.getElementById("school-list");
    let current_id = btn.children[1].children[0].id;
    let n = btn.id.slice(-1);
    let rule_box = document.querySelector("#dd-rules-" + n);

    let group = getCurrentRules(groups, current_id);

    // Button selection toggle and add/remove rules in table.
    if(btn.classList.contains("btn-selected")) {
        btn.classList.remove("btn-selected");
        document.getElementById("school-item-" + n).remove();
    } else {
        btn.classList.add("btn-selected");
        let row = document.createElement("tr");
        row.setAttribute("id", "school-item-" + n);
        let data = document.createElement("td");
        data.innerHTML = group.displayName;
        for (let i = 0; i < group.rules.length; i++) {
            let p = document.createElement("li");
            p.setAttribute("id", "p-rule-" + n + "-" + i);
            p.innerHTML = group.rules[i].displayName;
            //p.classList.add("invalid");
            data.append(p);
        }
        row.appendChild(data);
        table.appendChild(row);
    }

    // Handle placeholder text.
    if(document.getElementById("table-placeholder")) {
        document.getElementById("table-placeholder").remove()
    } else if (table.childNodes.length == 2) {
        let row = document.createElement("tr");
        let plcholder = document.createElement("td");
        row.setAttribute("id", "table-placeholder");
        plcholder.innerText = "No rules selected!";
        row.appendChild(plcholder);
        table.appendChild(row);
    }

    testingPasswords("");
}


// Page 1: toggle between show/hide entered password.
function togglePassword() {
    var x = document.getElementById("password-input");
    var y = document.getElementById("eye-open"); 
    var z = document.getElementById("eye-closed"); 
    if(x.type === "password") {
        x.type = "text"; 
        z.style.display = "none"; 
        y.style.display = "inline"; 
    } else {
        x.type = "password";
        y.style.display = "none"; 
        z.style.display = "inline"; 
    }
}

// Given a list of rules and a school id to match,
// returns the parsed set of rules for that particular school.
function getCurrentRules(rules, id) {
    for(let i = 0; i < rules.length; i++) {
        if(rules[i].groupId == id) {
            current_rules = rules[i];
        }
    }
    return parseGroup(current_rules);
}
