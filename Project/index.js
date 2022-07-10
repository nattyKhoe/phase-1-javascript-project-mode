window.onload=function(){
    //list of items
    const form = document.querySelector("#biodata");
    const biodataResult = document.querySelector("#biodataResult");
    const menu = document.querySelector("#menu");
    // const mealPlan = document.querySelector("#mealPlan");
    const result = document.getElementById("result");
    const breakfast = document.getElementById("breakfast");
    const lunch = document.getElementById("lunch");
    const dinner = document.getElementById("dinner");
    
    // initialising the global variables;
    const initialValue =[0,0,0,0];
    let breakfastValue = [...initialValue]
    let lunchValue =[...initialValue];
    let dinnerValue =[...initialValue];
    let bmr = 0;
    let goalValue = 0;
    let protein = 0;
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

    //function-list
    function navbarDeactivate () {
        chickenBtn.disabled = true;
        beefBtn.disabled = true;
        lambBtn.disabled = true;
        seafoodBtn.disabled = true;
        vegBtn.disabled = true;
        veganBtn.disabled = true;
    }

    //Reset Value Function
    function resetValue () {
        navbarDeactivate();
        biodataResult.className = "hidden";
        menu.innerHTML ="";
        breakfastValue = [...initialValue];
        lunchValue =[...initialValue];
        dinnerValue =[...initialValue];
        bmr = 0;
        goalValue = 0;
        protein = 0;
        adjCal = 0;
        adjbmr = 0;
        actCal = 0;
        actProt = 0;
        actCarb = 0;
        actFat = 0;
    }

    function navbarActivate () {
        chickenBtn.disabled = false;
        beefBtn.disabled = false;
        lambBtn.disabled = false;
        seafoodBtn.disabled = false;
        vegBtn.disabled = false;
        veganBtn.disabled = false;
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
        fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(r => r.json())
        .then(data =>{
            let mealContainer = menu.querySelector(`#${containerID}`);
            let container = document.createElement("div");
            container.className ="infoBox";
            //append to the next sibling i.e. insert after

            mealContainer.parentNode.insertBefore(container,mealContainer.nextSibling);

            // insertAfter(container, mealContainer);

            let infoClose = document.createElement("button");
            infoClose.className ="closeBtn"
            infoClose.innerText = "Close";
            container.appendChild(infoClose);

            container.appendChild(document.createElement("br"));
            container.appendChild(document.createElement("br"));

            let ingredientListTitle = document.createElement("h4");
            ingredientListTitle.innerText = "Ingredient List";
            container.appendChild(ingredientListTitle);

            let ingredientList = document.createElement("ul");
            container.appendChild(ingredientList);
        
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
            container.appendChild(mealDescTitle);

            let mealDesc = document.createElement("p");
            mealDesc.innerText = data.meals[0].strInstructions;
            container.appendChild(mealDesc);

            let mealURL = document.createElement("a");
            mealURL.innerText = "WATCH \u25B6";
            mealURL.href = data.meals[0].strYoutube;
            container.appendChild(mealURL);

        })
        .catch(console.error);
    };

    function fetchMeals (category){
        fetch (`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then (response => response.json())
        .then (data =>{
            for (let i = 0; i <data.meals.length; i++){

            let smallMealContainer = document.createElement("div");
            smallMealContainer.setAttribute("class","smallMealContainer");
            let mealNameSearch = data.meals[i].strMeal.toLowerCase().split(" ").join("%20");
            smallMealContainer.setAttribute("id", data.meals[i].strMeal.split(" ").join("-"));
            menu.appendChild(smallMealContainer);
                
            let mealName = document.createElement("h5");
            mealName.innerText = data.meals[i].strMeal;
            smallMealContainer.appendChild(mealName);

            let mealImg = document.createElement("img");
            mealImg.className = "mealImg";
            mealImg.setAttribute("id", data.meals[i].idMeal);
            mealImg.src = data.meals[i].strMealThumb;
            smallMealContainer.appendChild(mealImg);
        
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
                smallMealContainer.appendChild(calContainer);
        
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
                smallMealContainer.appendChild(calNFhidden);
            })
            .catch(err => console.error(err));
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

    function heightConverter(num,unit){// all height will be converted to cm
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
            actualCal.innerText = `Calorie Intake: ${actCal} cals \nCarbs: ${actCarb}g Protein: ${actProt}g Fat: ${actFat}g.`;
    };

    //onload deactivating navbar until further info being put
    navbarDeactivate();
    resetValue();

    //addEventListener list;
    form.addEventListener("submit", function(e){
        e.preventDefault();
        
        //activating menuNavbar
        navbarActivate();

        //unhidden the MenuPlan
        biodataResult.className = "unhidden";

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
            bmr = 664.7+113.75*userWeight+5.003*userHeight-6.755*userAge;
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
        resultRecCal.innerText = `Recomended Calorie Intake : ${adjCal} Cal.`;
        result.appendChild(resultRecCal);

        const adjProt = parseInt(userWeight*protein);
        const resultRecProtein = document.createElement("li");
        resultRecProtein.innerText =`Recomended Protein Intake : ${adjProt} g.`;
        result.appendChild(resultRecProtein);

        const actualCal = document.createElement("h5");
        actualCal.setAttribute("id", "actualCal");
        result.appendChild(actualCal);

        updateValueText(actualCal);

        fetchMeals("Chicken");
    });

    form.addEventListener("reset", function(e){
        resetValue();
    });

    navbar.addEventListener("click", function(e){
    if (e.target.tagName = "BUTTON"){
        menu.innerHTML="";
        fetchMeals(e.target.id);
    }
    });

    menu.addEventListener("click", function(e){
        if (e.target.tagName === "IMG"){
            let mealID = e.target.id;
            fetchFurtherInfo(mealID, e.target.parentNode.id);
        }

        if (e.target.innerText === "CLOSE"){
            e.target.parentNode.remove();
        }

        if (e.target.tagName === "BUTTON"){
            if(e.target.innerText === "BREAKFAST"){
                addMealValue(breakfast, "Breakfast", e.target.parentNode.parentNode, breakfastValue);
                updateValue(breakfastValue,lunchValue,dinnerValue);

            }
            if(e.target.innerText === "LUNCH"){
                addMealValue(lunch, "Lunch", e.target.parentNode.parentNode, lunchValue);
                updateValue(breakfastValue,lunchValue,dinnerValue);
             
            }
            if(e.target.innerText === "DINNER"){
                addMealValue(dinner, "Dinner", e.target.parentNode.parentNode, dinnerValue);
                updateValue(breakfastValue,lunchValue,dinnerValue);
           
            }
        }
    });

    biodataResult.addEventListener("click", function(e){
        form.reset();
        e.preventDefault();
        resetValue();
    })
}