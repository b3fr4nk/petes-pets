if (document.querySelector('#new-pet')) {
  document.querySelector('#new-pet').addEventListener('submit', (e) => {
    e.preventDefault();
    // Use FormData to grab everything now that we have files mixed in with text
    const form = document.getElementById('new-pet');
    const pet = new FormData(form);

    console.log(form);

    // Assign the multipart/form-data headers to axios does a proper post
    axios.post('/pets', pet)
        .then(function(response) {
          window.location.replace(`/pets/${response.data.pet._id}`);
        })
        .catch(function(error) {
          const alert = document.getElementById('alert');
          alert.classList.add('alert-warning');
          // eslint-disable-next-line max-len
          alert.textContent = 'Oops, something went wrong saving your pet. Please check your information and try again.';
          alert.style.display = 'block';
          setTimeout(() => {
            alert.style.display = 'none';
            alert.classList.remove('alert-warning');
          }, 3000);
        });
  });
}
