window.onload=function(){
    //list of items
    const userProfile = document.querySelector("#biodataContainer");
    const form = document.querySelector("#biodata");
    const biodataResult = document.querySelector("#biodataResult");
    const menu = document.querySelector("#menu");
    // const mealPlan = document.querySelector("#mealPlan");
    const result = document.getElementById("result");
    const breakfast = document.getElementById("breakfast");
    const lunch = document.getElementById("lunch");
    const dinner = document.getElementById("dinner");
    
    // initialising the global variables;
    let infoBoxIDArray = [];
    const initialValue =[0,0,0,0];
    let breakfastValue = [...initialValue]
    let lunchValue =[...initialValue];
    let dinnerValue =[...initialValue];
    let bmr = 0;
    let goalValue = 0;
    let protein = 0;
    let adjProt = 0;
    let adjCal = 0;
    let adjbmr = 0;
    let actCal = 0;
    let actProt = 0;
    let actCarb = 0;
    let actFat = 0;
    
    const navbar = document.querySelector("#navbar");
    const chickenBtn =document.querySelector("#Chicken");
    const beefBtn =document.querySelector("#Beef");
    const lambBtn =document.querySelector("#Lamb");
    const seafoodBtn =document.querySelector("#Seafood");
    const vegBtn =document.querySelector("#Vegetarian");
    const veganBtn =document.querySelector("#Vegan");
    const allBtn = [chickenBtn,beefBtn,lambBtn,seafoodBtn,vegBtn,veganBtn];

    //function-list

    function navbarActivate () {
        navbar.className="unhidden";
    }

    function navbarDeactivate () {
        navbar.className ="hidden";
    }

    //Reset Value Function
    function resetValue () {
        navbarDeactivate();
        biodataResult.className = "hidden";
        userProfile.className = "unhidden container";
        menu.innerHTML ="";
        breakfast.innerHTML = "";
        lunch.innerHTML = "";
        dinner.innerHTML = "";
        breakfastValue = [...initialValue];
        lunchValue =[...initialValue];
        dinnerValue =[...initialValue];
        bmr = 0;
        goalValue = 0;
        protein = 0;
        adjProt =0;
        adjCal = 0;
        adjbmr = 0;
        actCal = 0;
        actProt = 0;
        actCarb = 0;
        actFat = 0;
    }

    function addMealValue (meal, mealText, cloneTarget, mealValue){
        meal.innerHTML = "";

        let cloned = cloneTarget.cloneNode(true);
        cloned.querySelector('#calContainer').remove();
        let oldMealTitle = cloned.querySelector('h5');
        let newMealTitle = document.createElement("h6");
        newMealTitle.innerText = mealText + '\n' + oldMealTitle.innerText;

        cloned.replaceChild(newMealTitle,oldMealTitle);

        let NF = cloned.querySelector(".hidden").innerText.split(" ");

        mealValue[0] = parseInt(NF[0]);
        mealValue[1] = parseInt(NF[1]);
        mealValue[2] = parseInt(NF[2]);
        mealValue[3] = parseInt(NF[3]);

        meal.appendChild(cloned);

        let nv = document.createElement("p");
        cloned.appendChild(nv);
        nv.innerText = "Cal:" + NF[0] + "cal C:"+ NF[1] +"g P:" + NF[2]+ "g F:" + NF[3] + "g";

    }

    function fetchFurtherInfo (mealID, containerID){
        let mealContainer = menu.querySelector(`#${containerID}`);
        let infoBox = document.createElement("div");
        infoBox.className ="infoBox";
        mealContainer.appendChild(infoBox)
        //append to the next sibling i.e. insert after

        let menuPage = mealContainer.querySelector(`#menuPage`);
        menuPage.setAttribute("class", "hidden");

        let infoClose = document.createElement("button");
        infoClose.className ="closeBtn"
        infoClose.innerText = "Close";
        infoBox.appendChild(infoClose);

        infoBox.appendChild(document.createElement("br"));
        infoBox.appendChild(document.createElement("br"));

        let ingredientListTitle = document.createElement("h4");
        ingredientListTitle.innerText = "Ingredient List";
        infoBox.appendChild(ingredientListTitle);

        fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(r => r.json())
        .then(data =>{

            let ingredientList = document.createElement("ul");
            infoBox.appendChild(ingredientList);
        
            for (let i = 1; i<=20; i++){
                let ingredientID = "strIngredient" + i;
                let measureID = "strMeasure" + i;
                let dataMeals = {... data.meals[0]};
                if (dataMeals[ingredientID]){
                    let list = document.createElement("li");
                    let measure = dataMeals[measureID];
                    let ingredient = dataMeals[ingredientID];
                    list.innerText = `${measure}  ${ingredient}`;
                    ingredientList.appendChild(list);
                }
            };
            let mealDescTitle = document.createElement("h4");
            mealDescTitle.innerText = "Instructions";
            infoBox.appendChild(mealDescTitle);

            let mealDesc = document.createElement("p");
            mealDesc.innerText = data.meals[0].strInstructions;
            infoBox.appendChild(mealDesc);

            let mealURL = document.createElement("a");
            mealURL.innerText = "WATCH \u25B6";
            mealURL.href = data.meals[0].strYoutube;
            infoBox.appendChild(mealURL);

        })
        .catch(error => {
            mealDescTitle.innerText = "Sorry, no instruction is found";
        });
    };

    function fetchMeals (category){
        fetch (`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then (response => response.json())
        .then (data =>{
            for (let i = 0; i <data.meals.length; i++){

            let smallMealContainer = document.createElement("div");
            smallMealContainer.setAttribute("class","smallMealContainer");
            let mealNameSearch = data.meals[i].strMeal.toLowerCase().split(" ").join("%20");
            //to tackle the '&' sign in some of the menuName, sanitising the 'string'
            smallMealContainer.setAttribute("id", data.meals[i].strMeal.replace(/[^a-zA-Z0-9]/g,'').split(" ").join("-"));
            menu.appendChild(smallMealContainer);

            let menuPage = document.createElement("div");
            menuPage.setAttribute ("id", "menuPage");
            smallMealContainer.appendChild(menuPage);
                
            let mealName = document.createElement("h5");
            mealName.innerText = data.meals[i].strMeal;
            menuPage.appendChild(mealName);

            let mealImg = document.createElement("img");
            mealImg.className = "mealImg";
            mealImg.setAttribute("id", data.meals[i].idMeal);
            mealImg.src = data.meals[i].strMealThumb;
            menuPage.appendChild(mealImg);
        
            //authentication of nutritionix-api, with the key.
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'be37f4cd8fmsh7113488117c9530p103f3fjsnae469d7cae6a',
                    'X-RapidAPI-Host': 'nutritionix-api.p.rapidapi.com'
                }
            };
            
            fetch(`https://nutritionix-api.p.rapidapi.com/v1_1/search/${mealNameSearch}?fields=nf_protein%2Cnf_calories%2Cnf_total_fat%2Cnf_total_carbohydrate`, options)
            .then(response => response.json())
            .then(data => {

                let mealProtein = data.hits[0].fields.nf_protein;
                let mealFat = data.hits[0].fields.nf_total_fat;
                let mealCal = data.hits[0].fields.nf_calories;
                let mealCarbs = data.hits[0].fields.nf_total_carbohydrate;

                let calContainer = document.createElement("div");
                calContainer.setAttribute("id", "calContainer");
                menuPage.appendChild(calContainer);
        
                let mealCalTitle = document.createElement("span");
                mealCalTitle.innerText = `Calories ${mealCal}Cal`;
                calContainer.appendChild(mealCalTitle);
                
                calContainer.appendChild(document.createElement("br"));

                let mealNF = document.createElement("span");
                mealNF.innerText = `Carb ${mealCarbs}g  Protein ${mealProtein}g  Fat ${mealFat}g`
                calContainer.appendChild(mealNF);

                calContainer.appendChild(document.createElement("br"));

                let breakBtn = document.createElement("button");
                breakBtn.innerText = "Breakfast";
                breakBtn.className = "add"
                calContainer.appendChild(breakBtn);

                let lunchBtn = document.createElement("button");
                lunchBtn.innerText = "Lunch";
                lunchBtn.className = "add"
                calContainer.appendChild(lunchBtn);

                let dinnerBtn = document.createElement("button");
                dinnerBtn.innerText = "Dinner";
                dinnerBtn.className = "add"
                calContainer.appendChild(dinnerBtn);

                const calNFhidden = document.createElement("a");
                calNFhidden.className="hidden";
                calNFhidden.innerText = `${mealCal} ${mealCarbs} ${mealProtein} ${mealFat}`
                menuPage.appendChild(calNFhidden);
            })
            .catch(e => {
                let errContainer = document.createElement("div");
                errContainer.setAttribute ("class", "error");
                errContainer.innerText = "Cannot determine the nutritional values"
                menuPage.appendChild(errContainer);
            });
            }

        })
        .catch(console.error);
    };

    function weightConverter(num, unit){ //all weight will be converted to kg
        if (unit === "kg"){
            return num;
        } else {
            return num/2.20462;
        }
    };

    function heightConverter(num, unit){// all height will be converted to cm
        if(unit === "cm"){
            return num;
        } else {
            return num/0.0328084
        }
    };

    function updateValueText (actualCal){
        actualCal.innerText = `Calorie Intake: ${actCal} cals \nCarbs: ${actCarb}g Protein: ${actProt}g Fat: ${actFat}g.`
    };

    function updateValue (breakfast,lunch,dinner){
            actCal = breakfast[0]+lunch[0]+dinner[0];
            actCarb = breakfast[1]+lunch[1]+dinner[1];
            actProt = breakfast[2]+lunch[2]+dinner[2];
            actFat = breakfast[3]+lunch[3]+dinner[3];

            const actualCal = document.querySelector("#actualCal");
            actualCal.innerHTML = `Calorie Intake: <span id = "calNum">${actCal}cals</span> \nCarbs: ${actCarb}g Protein: <span id = "protNum">${actProt}g</span> Fat: ${actFat}g.`;

            const calNum = document.querySelector('#calNum');
            const protNum = document.querySelector("#protNum");

            if (actCal > adjCal){
                calNum.className = "red";
            } else {
                calNum.className = "green";
            }

            if (actProt < adjProt){
                protNum.className ="red";
            } else {
                protNum.className ="green";
            }
    };

    //onload deactivating navbar until further info being put to initialise the page
    navbarDeactivate();
    resetValue();

    //addEventListener list;
    form.addEventListener("submit", function(e){
        e.preventDefault();
        
        //activating menuNavbar
        navbarActivate();

        //unhidden the MenuPlan
        biodataResult.className = "container unhidden";
        userProfile.className = "hidden";

        //captioning value upon submission
        const userAge = document.querySelector("#age").value;
        const userSex = document.querySelector('input[name="sex"]:checked').value;
        const userWeight = weightConverter(document.querySelector("#weight").value, document.querySelector('input[name="weightUnit"]:checked').value);
        const userHeight = heightConverter(document.querySelector('#height').value, document.querySelector('input[name="heightUnit"]:checked').value);
        const userLevel = document.querySelector('input[name="level"]').value;
        const userGoal = document.querySelector('input[name="goal"]').value;


        //bmr according to sex// source:diabetes.org
        if (userSex === "female"){
            bmr = 655.1+9.563*userWeight+1.85*userHeight-4.676*userAge;
        } else if (userSex ==="male"){
            bmr = 664.7+1.1375*userWeight+5.003*userHeight-6.755*userAge;
        }

        //adjusting the energyexpenditure to user level of activeness.// source:diabetes.org

        switch (userLevel){
            case "Sedentary": 
                adjbmr = parseInt(1.2*bmr);
                if (userAge>=19 &&userAge<=70){
                    if (userSex === "male"){
                        protein = 0.84;
                    } else {
                        protein = 0.75;
                    }
                } else {
                    if (userSex === "male"){
                        protein = 1.07;
                    } else {
                        protein = 0.94;
                    }
                }
                break;
            
            case "Lightly active":
                adjbmr = parseInt(1.375*bmr);
                protein = 1.2;
                break;
            
            case "Moderately active":
                adjbmr = parseInt(1.55*bmr);
                protein = 1.6;
                break;

            case "Very active":
                adjbmr = parseInt(1.725*bmr);
                protein = 1.8;
                break;
            
            case "Extra Active":
                adjbmr = parseInt(1.9*bmr);
                protein = 2;
                break;
        }

        //adjusting recommended Calories based on goals
        switch (userGoal) {
            case "Lose Weight":
                goalValue = -500;
                break;

            case "Maintain Weight":
                goalValue = 0;
                break;

            case "Gain Weight":
                goalValue = 500;
                break;

        }

        result.innerHTML ="";

        const biodataTitle = document.createElement("h5");
        biodataTitle.innerText = "Result";
        result.appendChild(biodataTitle);

        const resultBmr = document.createElement("li");
        resultBmr.innerText = `Energy Expenditure: ${adjbmr} Cal.`;
        result.appendChild(resultBmr);

        adjCal = adjbmr+goalValue;
        const resultRecCal = document.createElement("li");
        resultRecCal.innerHTML = `Recomended Calorie Intake : ${adjCal} Cal.`;
        result.appendChild(resultRecCal);

        adjProt = parseInt(userWeight*protein);
        const resultRecProtein = document.createElement("li");
        resultRecProtein.innerText =`Recomended Protein Intake : ${adjProt} g.`;
        result.appendChild(resultRecProtein);

        const actualCal = document.createElement("h5");
        actualCal.setAttribute("id", "actualCal");
        result.appendChild(actualCal);

        updateValueText(actualCal);

        fetchMeals("Chicken");
        chickenBtn.className = "selected"
    });

    form.addEventListener("reset", function(e){
        resetValue();
        navbarDeactivate();
    });

    navbar.addEventListener("click", function(e){
    if (e.target.tagName = "BUTTON"){
        menu.innerHTML="";
        fetchMeals(e.target.id);
        allBtn.forEach(e=>{
            e.classList.remove("selected");
        });
        e.target.className = "selected";
    }
    });

    menu.addEventListener("click", function(e){
        let mealID = e.target.id;
        if (e.target.tagName === "IMG"){
            if (infoBoxIDArray.find(element=> element === mealID)){
                //if the same image has been clicked and the infoBox has not been closed, there will be no event listener
            } else {
            fetchFurtherInfo(mealID, e.target.parentNode.parentNode.id);
            infoBoxIDArray.push(mealID);
            }
        }

        if (e.target.innerText === "CLOSE"){
            e.target.parentNode.parentNode.querySelector("#menuPage").classList.remove("hidden");
            e.target.parentNode.remove();
            //enabling the same image being clicked again.
            infoBoxIDArray = [...infoBoxIDArray.filter(function(val){val != e.target.parentNode.id})];
        }

        if (e.target.tagName === "BUTTON"){
            if(e.target.innerText === "BREAKFAST"){
                addMealValue(breakfast, "Breakfast", e.target.parentNode.parentNode, breakfastValue);
            }
            if(e.target.innerText === "LUNCH"){
                addMealValue(lunch, "Lunch", e.target.parentNode.parentNode, lunchValue);
             
            }
            if(e.target.innerText === "DINNER"){
                addMealValue(dinner, "Dinner", e.target.parentNode.parentNode, dinnerValue);
            }
            updateValue(breakfastValue,lunchValue,dinnerValue);
        }
    });

    biodataResult.addEventListener("click", function(e){
        if (e.target.tagName === "BUTTON"){
        form.reset();
        e.preventDefault();
        resetValue();
        }
    })
}