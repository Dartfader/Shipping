
 import json from  './cities_list.js';

window.addEventListener('load', async e => {
    debugger;
    const citiesForm = document.querySelector('#cities-form'),
        citiesInput = citiesForm.querySelector('.cities__input'),
        citiesSelect = citiesForm.querySelector('.cities__select'),
        errorsBlock = citiesForm.querySelector(".errors"),
        citiesTemplate = document.querySelector('#cities-template'),
        cityNode = citiesTemplate.content.querySelector('.city'),
        baseOptionsNode = citiesTemplate.content.querySelector('.base-options'),
        weightOptionsNode = citiesTemplate.content.querySelector('.weight-options'),
        //jsonHref = window.location.href.replace('index.html', 'cities_list.js'),
       //jsonHref = require('../cities_list.js'),
        weightOptions=document.getElementsByClassName('weight-options'),
        citiesTitle=document.querySelector('.cities__title'),
        emptyField=document.querySelector('.empty_field');

    let citiesList, taxZones = {};
   // const res = await fetch(jsonHref);


        const data = json;
        citiesList = data.length ? data : [];
   

    citiesInput.addEventListener('input', (e) => {
        const inputValue = e.target.value.trim();
        citiesSelect.innerHTML = '';
        inputValue && citiesList.length && createRegionSelectOption(inputValue);

    });


    citiesSelect.addEventListener('click', ({ target }) => {

        if (target.tagName === 'BUTTON') {
            const closestParentCity = target.closest('.city'),
                parentBaseOptions = closestParentCity.querySelector('.base-options');
                console.log('parentBaseOptions', parentBaseOptions);
               const cityOption = closestParentCity.querySelector('.city__option'),
                cityName = cityOption.textContent,
                cityId = cityOption.value;

            (target.dataset.action === 'add-city' || target.dataset.action === 'remove-city') && addOrRemoveBaseOptions({ parentBaseOptions, target, cityName, cityId });
            (target.dataset.action === 'add-cost' || target.dataset.action === 'remove-cost') && addOrRemoveWeightOptions({ parentBaseOptions, target, cityName });
            console.log('parentBaseOptions', parentBaseOptions);
        }
    });


    function createRegionSelectOption(cityName) {
        citiesList.map(({ name, id }) => {
            const lowerCasedName = name.replace('г. ', '').toLowerCase();
            if (lowerCasedName.startsWith(cityName.toLowerCase())) {
                const city = document.importNode(cityNode, true),
                    cityOption = city.querySelector("option"),
                    cityButton = city.querySelector("button");

                cityOption.textContent = name;
                cityOption.setAttribute("value", id);
                cityButton.textContent = cityButton.dataset.action === 'add-city' ? 'Добавить' : 'Удалить';
                citiesSelect.append(city);
            }
        });
    }

    function addOrRemoveBaseOptions({ parentBaseOptions, target: button, cityName, cityId }) {

        if (button.dataset.action === 'add-city') {

            console.log('parentBaseOptions', parentBaseOptions);
            taxZones[cityName] = {
                'rate_area_id': cityId,
                'base_charge_value': null,
                'extra_charges': []
        };
            button.dataset.action = 'remove-city';
            button.textContent = 'Удалить';

            if (!parentBaseOptions) {
                console.log('parentBaseOptions', parentBaseOptions);
               let options = document.importNode(baseOptionsNode, true);
                button.parentNode.append(options);

                const addBaseCost = button.parentNode.querySelector('.base-options__input');
                addBaseCost.addEventListener('change',(e) => {
                    taxZones[cityName]['base_charge_value']=e.target.value;
                    let baseCost=taxZones[cityName]['base_charge_value'];
                    console.log( baseCost);
                    console.log('taxZones',taxZones);
                });
            }
        } else {

            delete taxZones[cityName];
            button.dataset.action = 'add-city';
            button.textContent = 'Добавить';
            if (parentBaseOptions) button.parentNode.removeChild(parentBaseOptions);
            console.log('parentBaseOptions', parentBaseOptions);
        }
    }

    function addOrRemoveWeightOptions({ parentBaseOptions, target: button, cityName }) { //деструктуризация
        if (button.dataset.action === 'add-cost') {
            const extraWeight = document.importNode(weightOptionsNode, true);
            let newObj= {
                'min_weight':0,
                'max_weight':0,
                 'charge_value':0,
            };
            parentBaseOptions.append(extraWeight);
            const weightMin=extraWeight.querySelector('input');
            extraWeight.addEventListener('input', (e) => {

                if (e.target.dataset.name === 'min') {
                   newObj['min_weight']=e.target.value;
                }
                if (e.target.dataset.name === 'max') {
                    newObj['max_weight']=e.target.value;
                }
                if (e.target.dataset.name === 'charge_value') {
                    newObj['charge_value']=e.target.value;
                }
                function calculateCost () {
                    let summ=parseInt(taxZones[cityName]['base_charge_value']) + parseInt(newObj['charge_value']);
                    let finalCost=extraWeight.querySelector('.weight-options__output');
                    finalCost.innerHTML='Итоговая стоимость равна=' + summ +'р';

                }
                calculateCost();
            });

            taxZones[cityName]['extra_charges'].push(newObj);
            //добавляем свойство 'extra_charges' в объект [cityName] объекта taxZones
            console.log('addArray',taxZones[cityName]); //создается объект с присвоеными свойствами

        }

        else {
                //удаление элемента
            const weightArr= Array.from(parentBaseOptions.querySelectorAll('button[data-action="remove-cost"]')) ;
            weightArr.map( (btn,index) => btn === button && (() => {
                taxZones[cityName]['extra_charges'] = taxZones[cityName]['extra_charges'].filter((item, i) => i !== index);
                parentBaseOptions.removeChild(button.parentNode);
                console.log('delArray',taxZones[cityName]);
            })());

        }
    }




});