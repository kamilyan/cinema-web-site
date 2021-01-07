(function () {

    function Start() {
        let buttons = $(".showAddMovieSection");
        for (const btn of buttons) {
            btn.addEventListener('click', () => {
                let id = btn.id
                $('#addNewMovieSection' + id).toggle();
                let frm = $('#addMovieForm' + id);
                frm.on("submit", function (ev) {
                    ev.preventDefault();
                    $.ajax({
                        url: frm.attr('action'),
                        type: 'PUT',
                        data: frm.serialize(),
                        success: function (data) {
                            $('#movieItems' + id).append(
                                "<li><a href='/movies/" + data.movie.movieId + "'>" + data.movie.movieName + "</a>, " + data.movie.date + "</li>"
                            );
                            $(".selectMovie" + id + " option[id=" + data.movie.movieId + "]").remove();
                        }
                    });
                });
            })
        }
    }

    window.addEventListener("load", Start);
})();