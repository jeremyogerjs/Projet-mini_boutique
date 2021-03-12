// YOUR NAME HERE

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products 
var total = 0;

let compteur = [];			// tableau stockant tout les bouttons de commande.

let quantité =[];			// stocke tout les inputs ( quantité de produit).

// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();
	commander();
	rechercher();	
	// TODO : add other initializations to achieve if you think it is required
};
window.addEventListener("load", init);

// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
};

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	
	// /!\ should add the figure of the product... does not work yet... /!\ 
	block.appendChild(createFigureBlock(product));

	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
};


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
};

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
var createOrderControlBlock = function (index) {
	var control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();
	
	quantité.push(input);
	// add input to control as its child
	control.appendChild(input);
	
	// create order button
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	button.style.cursor = 'pointer';

	compteur.push(button);	
	// add control to control as its child
	control.appendChild(button);
	
	// the built control div node is returned
	return control;
};


/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/
var createFigureBlock = function (product) {
	
	let image = "<img src = " + product.image +">";
	
	return createBlock("figure", image);				
};

 // Buy product--------------------------------------------------------------------------------->

 

let panier = function (product,index){				// fonction permettant d'afficher la commande dans le panier.

	let acheter = document.createElement('div');
	acheter.className = 'achat';
	acheter.id = index + "-"+ orderIdKey;	

	let achat = document.querySelector('.achats');
	
	achat.appendChild(acheter);

	acheter.appendChild(createFigureBlock(product));
	
	acheter.appendChild(createBlock("h4",product.name,'nom'));

	acheter.appendChild(createBlock("div",product.price,"prix"));

	return acheter;
	
};

let commander = ()=>{			// fonction permettant de commander.		

	for(let i = 0; i<compteur.length; i++){

		compteur[i].addEventListener('click',()=>{
			
			if(quantité[i].value != 0 ){
				panier(catalog[i],i);
				
				
				let quantity = document.createElement('div');								
				quantity.className = 'quantite';			
				
				let dernierAchat = document.querySelector('.achats').lastChild;
				let achat = document.querySelector('.achats').children;

				let poubelle = document.createElement('button');
				poubelle.className = ' retirer';

				poubelle.id = catalog[i].name;
				
				quantity.append(quantité[i].value);				
				dernierAchat.append(quantity);					

				dernierAchat.append(poubelle);      
				total += catalog[i].price * quantité[i].value;

				let totalPanier = document.querySelector('#montant');

				totalPanier.textContent = total;
				
				poubelle.addEventListener('click',()=>{		// event permettant de supprimer un élément du panier.
					
					total -= Number(poubelle.parentElement.childNodes[2].textContent) * Number(poubelle.parentElement.childNodes[3].textContent);
					totalPanier.textContent = total;
					poubelle.parentElement.remove();
				});							

				for(let j = 0 ; j< achat.length-1; j++){		// boucle permettant de ne pas avoir de doublon dans le panier et d'ajouter la quantité.
					if(dernierAchat.id == achat[j].id  && achat.length>1 ){
						achat[j].childNodes[3].textContent = Number(achat[j].childNodes[3].textContent) + Number(dernierAchat.childNodes[3].textContent);
						dernierAchat.remove();
					};
				}				
			}
			else{
				alert('veuillez saisir une quantité minimum ( 1 ).');
			};				
								
		});
	};
	
};
 

let recherche = ()=>{

	let filtre = document.querySelector('#filter').value.toUpperCase();
	let boutique = document.querySelector('#boutique');						// recupere la div qui contient tout les produit.
	let titreProduit = boutique.querySelectorAll('.produit');				// recupere tout les produit.

	for(let i=0; i<titreProduit.length; i++){								// parcours tout les produits

		let txtValue = titreProduit[i].firstChild.textContent;				// recupere l'élément a comparer, ici ce sont les titres ( h4);
			
		if( txtValue.toUpperCase().indexOf(filtre) > -1){					

			titreProduit[i].style.display = "";								// si sa correspond on ne fait rien.
				
		}else { 

			titreProduit[i].style.display = ' none';						// sinon on les caches.
		}		
	}
};

let rechercher = () =>{

	document.querySelector('#filter').addEventListener('keyup',()=>{
		
		recherche();
	});
};