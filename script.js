'use strict';

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///// ELEMENTS SELECTION /////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
/////// MODAL WINDOW ////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

/////////////////////////////////////////////////////////////////
////// SMOOTH SCROLLING ////////

btnScrollTo.addEventListener('click', function (e) {
  /////////////////
  // METHOD 1 (traditional)

  // Step 1: coordinates of the section we want to scroll to

  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // current scroll
  //---- console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  //////////////////////

  // Step 2: Setting the Scroll
  //--- to scroll normally, we use window.scrollTo(coordinates)

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // why are we adding page offset and our coordinates?
  //--- we get the coordinates in reference to the viewport of browser, not the position from top of the page.
  //--- that's why, coordinates become different everytime we scroll up or down.
  //--- that's why we add the distance (amount of px) we have scrolled to the coordinates to get the exact distance of an object from top of the page.

  //////////////////////////

  // Step 2: Setting the Scroll with smooth effect
  //--- to do it smoothly, we need to pass in an object instead of an argument
  //--- window.scrollTo({left: , top: , behavior:'smooth'})

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  ////////////////////////////

  // Scrolling smoothly (MODERN) (THIS IS IT)
  //--- destinationElement.scrollIntoView({behavior: })
  section1.scrollIntoView({ behavior: 'smooth' });
  //--- just take the destination element and call this function
  //--- and pass an object in the argument that says the behavior of the scroll.
});

////////////////////////////////////////////////////////////////////
///// PAGE NAVIGATION (SMOOTH) /////

// Technique 1: forEach()

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     // stopping browser to move to href location (via HTMl markup)
//     e.preventDefault();

//     // selecting the location of destination
//     const id = this.getAttribute('href'); //getAttribute is used as we only need the relative URL, not absolute
//     //--- using the location as a selector.

//     // Implementing smooth scrolling
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// Disadvantage of technique above
//--- Code is not efficient. same set of code is implemented to multiple elements
//--- will affect performance if no. of elements are 100 or 1000.

/////////////////////////////////

// What is more efficient?
// EVENT DELEGATION
//--- it works on the principle that event bubbles up
//--- we put the event listener on a common parent of all the elements we are interested in.
//--- this makes sure that if there are 50 elements we are interested in, there is still only 1 copy of the code.
//--- this improves performace, efficiency, and code is much cleaner.

// Technique 2 : Event Delegation

// Step 1 : add event listener to common parent element
// Step 2 : Determine what element originated the event

// 1. adding event listener to parent (the whole area of parent element is accessible now)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // 2. Matching Strategy (now, we filter the area)
  //----- we only want to work with the clicks that happen on the links
  //----- we select that area using if statement
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////////////////////////////////////

// TABBED COMPONENT

// Application of Event Delegation
//--- adding event listener to the container element instead of every single element separately

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy

  //--- e.target is the element on which the click event is happening
  //--- the problem is inside the button element, there is a child span element as well.
  //--- whenever we click on the serial no., we get the span element in return
  //--- we must only return the button element (in that particular area) for our tabbed component to work.

  // we do DOM TRAVERSING

  //--- we use closest method to move up in the DOM tree to the closest operations tab.
  const clicked = e.target.closest('.operations__tab');

  // GAURD CLAUSE

  //--- If we are clicking on the container area with no tabs, it returns null.
  //--- that's why we pass a gaurd clause
  //--- It is basically an if statement which is returned early if some condition is matched
  //--- In this case, if nothing is clicked (null is falsy value), we want to immediately finish the function
  //--- As function will be finished, none of the code after it will run
  if (!clicked) return;

  // ACTIVE TAB : Adding and Removing 'ACTIVE' class from tabs

  //--- whenever a tab is clicked, it should get an active class (to implement the CSS in UI)
  //--- at the same time, the previous tab should come back to normal.
  //--- To do this, we first remove the class from all the tabs and then add it to the clicked tab.
  // Removing
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // Adding
  clicked.classList.add('operations__tab--active');

  // Activate Content Area

  //--- firstly, again we would remove the active class from all the contents
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  //--- then, we select the element on which we want to add the active class.
  //--- with our code, it will work automatically
  //--- the tab that we click on, we take the tab no. from the dataset where we store it while writing the HTML
  //--- then, we use it to select the content using className
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////////////

// MENU FADE ANIMATION

///////// NOTE: Usually, we need two opposite mouse events in combination.
//////// EX: mouseover and mouseout, mouseenter and mouseleave, etc

// Function to handle hovering over navigation

//--- Advantage:
//--- re-factoring our code and makes it dry

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// BIND method to pass arguments into the handler function

//--- firslty, bind returns a new function. that new function then beecomes the callback function
//--- when we use bind method, the value gets assigned to the this variable of the function.
//--- we can then use this variable as an argument for the function.
//--- it works as if an argument is getting passed inside the function.

nav.addEventListener('mouseover', handleHover.bind(0.5)); // this = o.5
nav.addEventListener('mouseout', handleHover.bind(1)); // this = 1

//--- if we need to pass more than 1 value in a handler function, we can pass an array or object in bind()

/////////////////////////////////////////////////////////////////

// STICKY NAVIGATION BAR

// Method 1: Using Scroll Event

//--- scroll event is only available on window. Not document.
//--- fired each time we scroll on the page.
//--- that's why its not very efficient. Usually should be avoided

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);  // current scroll position. It is on the windows object, not the event

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

////////////////////////////

// Method 2 : THE INTERSECTION OBSERVER API

//--- Allows our code to OBSERVE changes in the way
//--- a certain target element INTERSECTS another element or
//--- the way it INTERSECTS the viewport

// How does it works??

// // Step 4 : Define the Callback Function

// const obsCallback = function (entries, observer) {
//   // callback funtion will get called each time our target element is intersecting the root element at the threshold that we have defined.
//   entries.forEach(entry => console.log(entry));
// };

// // Step 3 : Define the Root Element and the Threshold

// const obsOptions = {
//   root: null, // root is the element that the target is intersecting. NULL means that now we will be observing our target element intersecting the entire viewport.
//   threshold: [0, 0.2], // it is the percetage of the target section that is visible in the viewport (in this case) at which the observer will call the callback funtion.
// };

// // Step 1 : create a new intersection observer
// const observer = new IntersectionObserver(obsCallback, obsOptions);

// // Step 2 : now, we use this observer to observe a certain target
// observer.observe(section1); // section 1 is our target. We will be observing the target

////////

// Implementing Sticky Navigation

// When do we want to implement Sticky Navigation??
//--- when the header is out of view.
//--- That's why we will observe the header

const navHeight = nav.getBoundingClientRect().height; // calculating the height and using it dynamically.

const stickyNavCallback = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNavCallback, {
  root: null, // means viewport
  threshold: 0, // means completely out of view
  rootMargin: `-${navHeight}px`, // in order to increase or decrease the height of the target element. Basically to delay or to make the intersection happen early.
});
headerObserver.observe(header);

/////////////////////////////////////////////////////////////////

// REVEALING SECTIONS ON SCROLLING

// Callback Function as 1st argument for IntersectionObserver function

const revealSection = function (entries, observer) {
  const [entry] = entries; // destructuring to take out the entry of intersection
  // console.log(entry);

  // gaurd clause
  if (!entry.isIntersecting) return; // function will end here if the condition is true

  // removing hidden class on intersection with the partiular section
  //--- we dont want to remove the class from all the sections
  //--- just that element that is getting intersected.
  //--- entry.target is that element.
  entry.target.classList.remove('section--hidden');

  // unobserving the sections afterwards
  //--- after observing them once, we unobserve them
  //--- otherwise, JS will keep on observing them all the time
  //--- and this will affect our performance
  observer.unobserve(entry.target);
};

// new IntersectionObserver
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

// Looping over all the sections
allSections.forEach(function (section) {
  // Observing each section
  sectionObserver.observe(section);
  // Adding hidden class
  section.classList.add('section--hidden');
});

////////////////////////////////////////////////////////////////

// LAZY LOADING IMAGES

//--- Images has the biggest impact on page loading
//--- It's important that images are optimized on any page
//--- For that we can use a strategy called LAZY LOADING

// What is the effect??
//--- The low resolution images are loaded and blurred initially.
//--- As we approach the image and as soon as the image is ready, blurr effect is removed and original image is shown.

// Implementing using Intersecting Observer

// Selecting images
const imgTargets = document.querySelectorAll('img[data-src]'); // selecting only those images that has this property

// callback function
const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return; // gaurd clause

  // replacing placeholder image with the original image

  //--- we will replace the src attribute with the data--src attribute
  //--- replacing of the src attribute actually happens BTS
  //--- JS finds the image to load BTS and once it is loaded, JS emits the load event
  entry.target.src = entry.target.dataset.src;

  // Listening to the Load event

  //--- we can listen for the load event and then do something
  //--- we can remove the blur effect immediately as well, but if user's internet is slow, then they will be looking at low resolution image.
  //--- but if we add event listener, we can wait for image to load, and once loaded, we can remove the blur effect
  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });

  // unobserve images
  observer.unobserve(entry.target);
};

// constructing intersection observer
const observeImage = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // we dont want our users to notice that we are lazy loading images. That's why with this root margin, images will be loaded before user reaches them
});

// observing the images
imgTargets.forEach(img => observeImage.observe(img));

/////////////////////////////////////////////////////////////////

// SLIDER COMPONENT

// scaling down the slider
//--- making it easier to understand the concept
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';
//////////////////////////////

const slider = function () {
  // Elements
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  /////////////////////////

  // Functions

  // 1. Go to Slide Function
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // 2. Creating dots forEach slide Function
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // 3. Function to Activate Dots
  const activateDot = function (slide) {
    // removing active class from all the dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // adding active class using Data-Slide number
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) // selecting only that slide that has this particular attribute with the particular value
      .classList.add('dots__dot--active');
  };

  // 4. Initializer Function
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  ////////////////////////////

  // IMPLEMENTING SLIDER

  let currentSlide = 0;
  const maxSlide = slides.length;

  // 1. Moving to the NEXT slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // 2. Moving to PREVIOUS slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  ///////////////////////////

  // Event Handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide(); // if statement
    e.key === 'ArrowRight' && nextSlide(); // short-circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // using destructuring to get slide from dataset
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/*
///////    SELECTING, CREATING AND DELETING ELEMENTS

// selecting elements

// 1. directly
console.log(document.documentElement); // entire document
// use-case: apply CSS styles to the entire document, we need to use documentElement

console.log(document.head); // head
console.log(document.body); // body

/////  QUERY SELECTOR
//--- can be used with document(node-type) as mentioned below.

// 2. selecting the first element using a class
const header = document.querySelector('.header'); // returns the first element that matches the selector

// 3.selecting multiple elements using a class
const allSections = document.querySelectorAll('.section'); // returns all the elements that matches the selector
console.log(allSections); // allSections is a node list

//--- can also be used with elements(element node-type) as we learnt in BTS video
//--- there, we use it a lot to select child elements

/////  GET ELEMENT BY
// 4. selecting element using Id
document.getElementById('section--1');

// 5. selecting multiple elements using TagName
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
// allButtons is an HTML Collection
//--- it is a live collection
//--- if DOM changes, this collection gets updated immediately automatically
//--- sometimes this collection is helpful when working with DOM

// NODE LIST is different from HTML collection
//--- it is not a live list. does not get updated like this.

// 6. selecting multiple elements using className
document.getElementsByClassName('btn'); // returns a live collection

////////////////////////////////

// creating and inserting elements

// 1. inserting using insertAdjacentHTML ('position', string)
//----- we call it on that element adjacent to which we want to insert something
//----- position cab be - afterbegin, beforeend, beforebegin, afterend
//----- ex : header.insertAdjacentHTML ('afterbegin', 'fkswef');

// 2. creating using createElement
const message = document.createElement('div');
//----- it creates a DOM element and stores that into message.
//----- this element has been created, but its not yet in the DOM. To get it there, we have to manually insert it
//----- we can do anything with this element now.
// ADD CLASSES
message.classList.add('cookie-message');
// ADD TEXT CONTENT
// message.textContent = 'We use cookies for improved functionality and analytics.';
// ADD HTML
message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie"> Got it!</button>';

// 3. Inserting the created element into the DOM
// 3.1 prepend()
header.prepend(message); // prepend adds it to the beginning of the selected element (header)
// 3.2 append()
header.append(message); // append adds it at the end
//----- element only gets inserted once, not twice
//----- message is like a live element inside DOM, like a person
//----- can only be at 1 place at a time
//----- that's why we can use these methods not only to insert the element, but to also move to (to top or bottom)

// How to insert created elements at multiple places in DOM

// we need to make a copy using
// .cloneNode()
// header.prepend(message.cloneNode(true));

// 4. before method
// header.before(message); // inserts the element before the header element (not inside the header element)

// 5. after method
// header.after(message); // inserts the element after the header element (not inside the header element)

///////////////////////////////////////////////

// Delete elements
// 1. remove ()
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // newer technique
    // message.parentElement.removeChild(message); // older technique
  });

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

///// STYLES, ATTRIBUTES AND CLASSES

// STYLES

// setting a style on the element
//--- element.style.propertyName
//--- we write the value exactly like we would in CSS (with the unit)
//--- these are set as INLINE Styles. They become a part of HTML element in the DOM
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// reading style properties
console.log(message.style.backgroundColor); // it works as backgroundColor is an INLINE Style that we have set manually using the Style property
console.log(message.style.height); // not possible as it does not exist (neither INLINE nor externally)
console.log(message.style.color); // not possible though defined in CSS but it is not an INLINE Style
//----- we can only read those style properties that we have set manually and is an INLINE style
//----- cannot read properties that are hidden in the classes (defined externally) or are not present at all.

// How to read all the style properties(declared / not declared)?
// getComputedStyle(element); // this gives us an object with all properties and values of that element.
console.log(getComputedStyle(message).color); // this is how we read a property
console.log(getComputedStyle(message).height); // browser computed height

// increasing the height of the cookie banner?
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
//---- the computed height that we recieve here is a string (9px).
//---- we cannot add 40 directly to a string. We need to take the number out of the string to add 40 to it.
//---- that's why we use Number.parseFloat(number, base 10)
//---- now we get 9, we add 40 to it and then we add 'px' (the unit)

////////////////////////////////

// CSS CUSTOM PROPERTIES (AKA CSS VARIABLES)
//---- CSS custom properties function like a variable
//---- the idea of CSS variables is similar to variables in JS
//---- we can change a value at many places all over our CSS files by simply changing the value at their inception
//---- these properties are defined in the document root (:root). (equivalent to document in JS)
//---- these can be changed in JS as well

document.documentElement.style.setProperty('--color-primary', 'orangered');
// .setProperty('propertyname', 'new value')

///////////////////////////////////////////////////////////////////

// HTML ATTRIBUTES

// reading Standard HTML Atributes
//--- element.attribute
//--- only read standard properties using this method.
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // we can read these properties as these are standard properties
console.log(logo.src); // gives absolute URL
console.log(logo.className); // to read the class, we use className

// setting Standard HTML Attributes
logo.alt = 'Beautiful minimalist Logo';

// How to read non-standard property?
//--- element.getAttribute('attributeName')
console.log(logo.getAttribute('designer'));
console.log(logo.getAttribute('src')); // gives relative URL

// How to set non-standard property?
//--- element.setAttribute('attributeName', 'value')
logo.setAttribute('company', 'Bankist');

// example of absolute and relative URL
const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));
// both are absolute as it is an outsider link

const link2 = document.querySelector('.nav__link--btn');
console.log(link2.href);
console.log(link2.getAttribute('href'));
// here, we get the difference

//////////////////////////////////////

// DATA ATTRIBUTES (special kind of attributes)
//--- must start with 'data'
//--- these special attributes are stored in the DATASET object
//--- we first need access to the dataset using (element.dataset)
//--- from there, we can get access to the data property (using camel case)

console.log(logo.dataset.versionNumber);

///////////////////////////////////////

// CLASSES (brief)
//--- important methods
logo.classList.add('c', 'j'); // can add multiple classes by writing comma separated
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');
*/
/////////////////////////////////////////////////////////////////
/*
// EVENTS

//--- event is a signal that is generated by a certain DOM Node
//--- signal means something has happened.
//--- anything of importance that happens on our webpage generates an event

//--- we can use EVENT LISTENERS to listen for these events and handle them as we like

// TPYES OF EVENTS

// 'mouseenter' event (whenever mouse enters an area)
const h1 = document.querySelector('h1');

const alerth1 = function (e) {
  alert('addEventListener: Great! You are reading the heading!');

  // removing the event handler after listening once (1)

  // h1.removeEventListener('mouseenter', alerth1);
  //------ this allows us to listen to the event once and then remove it automatically
};

// Adding the handler function

// 1. using 'addEventListener'

h1.addEventListener('mouseenter', alerth1);

// removing event handler using timer (2)

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000);

//---- modern method. nowadays used prominantly
//---- it is better as it allows us to add multiple event listeners(functions) to the same event(mouseenter)
//---- we can add another 'mouseenter' simply with a new function and both will work
//---- also, we can simply remove an event handler in case we dont need it anymore

// 2. directly using name of the event

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading!');
// };

//---- old school, used earlier, not so frequently today
//---- if we add multiple event listeners here, second one will override the first one.
*/
//////////////////////////////////////////////////////////////////
/*
// EVENT PROPOGATION
//--- change in location of an event from parent to child (capturing phase) and from child back to parent (bubbling phase) is known as event propogation.

// Imp
//--- addeventlisteners listens to events in the bubbling phase as it is their default behavior
//--- this is because listening in capturing phase is not that useful, while listening in bubbling phase is useful
//--- it is important for EVENT DELEGATION.

// How to listen to to events in the Capturing Phase??
//--- we can add a third parameters on event handler functions (after 'click' and 'function')
//--- to listen in capturing phase, we just have to pass 'true'.
//--- they will stop listening to events in bubbling phase.
//--- visually, it will look similar, but in practise, the event first passes through the parent and then the child

// Illustration :
//--- Attaching event handlers to navigation link and its parent elements
//--- We will give these elements random background colors
//--- This will allow us to visualize how event bubbling is happening

// STEP 1-- generating random colors
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

console.log(randomColor());

// STEP 2-- adding event handlers

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget); // target is place of origin. Where the event first happened.

  // stopping propogation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  }
  // true // this means that the element will listen to the event in capturing phase
);
*/
////////////////////////////////////////////////////////////////////////
/*
// DOM TRAVERSING

//--- It basically means walking through the DOM.
//--- we can select elements based on other elements.
//--- It allows us to select elements relative to others
//--- EXAMPLE - direct child, or direct parent, or sometimes we are not even aware of the structure

///// Illustration : traversing around H1 element
const h1 = document.querySelector('h1');

// A. Going Downwards (child elements)

// A.1 using QuerySelector() and querySelectorAll
//--- can go down as deep as possible in the DOM tree to select child elements
//--- if there were other highligh elements on the page, they would not be selected as they are not children of h1 element
console.log(h1.querySelectorAll('.highlight'));
//--- we get a node list with the elements

// A.2 using childNodes (only direct children)
//--- not that used
//--- gives us every single node of every single type that exists
console.log(h1.childNodes);
//--- we get a node list of all kinds of stuff (text, comment, br, span)

// A.3 using children (only direct children elements)
//--- used more istead of childnodes
console.log(h1.children);
//--- we get a live HTML collection of the elements that are actually inside of the h1 element

// A.4 firstElementChild and lastElementChild
//--- can be used to set properties of the first and last child element
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

/////////////////////

// B. Going Upwards (parents)

// B.1 For direct parents (parentNode, parentElement)
console.log(h1.parentNode);
console.log(h1.parentElement);
//--- both gives same result as there can only be 1 direct parent

// B.2 .closest()
//--- allows us to find the nearest parent element with a className
//--- very important. will be used all the time during event delegation

//--- if there are multiple elements with a className header, but we want to find the one that is parent of h1
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';
//--- can be seen as opposite of QuerySelector.
//--- given similar string. querySelector finds children, closest find parents

/////////////////////

// C. Going Sideways (siblings)
//--- In JS, we can only find direct siblings

// C.1 to get only the elements
console.log(h1.previousElementSibling); // null
console.log(h1.nextElementSibling); // the h4 element
//--- If it is the first element, then there are no previous siblings
//--- If it is the last element, then there are no next siblings

// C.2 to get nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// How to select all the siblings instead of only direct ones
//--- we can first move up to the parent element and then read all the children
console.log(h1.parentElement.children);

// use-case (making it to an array and looping)
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
//////////////////////////////////////////////////////////////////
/*
// LIFECYCLE DOM EVENTS

//--- Lifecycle means from the time the page is first accessed till the user leaves it.

// 1. DOM Content Loaded event

//--- fired by the document as soon as the HTML is completely parsed.
//--- In simple words, the HTML has been downloaded and converted to DOM tree.
//--- Also, all scripts must be downloaded and executed before this event is fired.
//--- It does not wait for images and other external resources to load
//--- Just HTML and JS needs to be loaded

//--- this event can be listened on the document.
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// 2. Load event
//--- fired by the window as soon as not only the HTML is parsed, but also images, external resources like CSS files are also loaded
//--- basically, when the complete page has finished loading

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

// 3. Before Unload event
//--- It is created immediately before a user is about to leave the page
//--- For example, after clicking the close button on the browser tab
//--- As we are about to leave the page, we get a pop up on the page, which asks us whether we want to leave the site / reload the page
//--- Dont abuse this kind of power on the user
//--- It can be done in a few cases - 
//--- 1. When a user is leaving the page in the middle of filling a form
//--- 2. or writing a blog post on an article
//--- 3. Situations where data can be lost 

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // not mandatory
//   console.log(e);
//   e.returnValue = ''; // empty string for historical reasons
//   // no matter what we write in the empty string, we will get the same generic message in the pop up.
// });
*/
//////////////////////////////////////////////////////////////////
