
const icon = document.querySelector('#togglePassword'); 
const pass =document.querySelector('.password'); 

document.querySelectorAll('.swiper-slide').forEach(function(slide) {
    slide.addEventListener('click', function() {
        // Remove the selected class from all slides
        document.querySelectorAll('.swiper-slide').forEach(function(slide) {
            slide.classList.remove('selected');
        });
        
        // Add the selected class to the clicked slide
        slide.classList.add('selected');
        
        // Set the background color of all slides to default
        document.querySelectorAll('.swiper-slide').forEach(function(slide) {
            slide.style.boxShadow = '';
            slide.style.border='';
        });
        
        // Set the background color of the clicked slide to green
        slide.style.backgroundColor = '#EEEEEE';
        // slide.style.box-shadow= '0 0 10px red';
        slide.style.boxShadow = '0 0 10px green';
        slide.style.border='2.5px solid green';
        
    });
});
const outputDiv = document.querySelector('.output');
const summarizeButton = document.querySelector('.summarize button');

outputDiv.style.display = 'none';

summarizeButton.addEventListener('click', function() {
    outputDiv.style.display = 'block';


    fetch('https://api.example.com/endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: 'example' })
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            console.log(data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });


});
 
// const verifyButton = document.querySelector('.verify');
// const slideWrapper = document.querySelector('.options');
// // slideWrapper.style.display = 'none';
// verifyButton.addEventListener('click', function() {
//     document.querySelector('.instructions').style.display = 'none';
//     // slideWrapper.style.display = 'block';
//      slideWrapper.classList.toggle('hidden')
//      document.querySelector('.summarize').classList.remove('hidden');
//     //  summarizeButton.classList.toggle('show');
//      console.log('clicked');
// });

