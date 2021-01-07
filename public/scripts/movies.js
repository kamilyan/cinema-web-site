(function () {
    function Start() {
        let movieTab = document.getElementById('allMovies');
    
        if(movieTab.classList.contains('active')){
            $('#searchButton').click(() => {
                let value = $('#searchMovie').val().toLowerCase();
                $(".cardMovies").filter(function () {
                    $(this).toggle($(this).find("h4").text().split(",")[0].toLowerCase().indexOf(value) > -1)
                });
            });
        }
        else {
            $('#searchMovieBar').hide();
        }
    }

    window.addEventListener("load", Start);
})();