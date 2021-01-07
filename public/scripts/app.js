(function () {

    function activateNavbar() {
        let name = window.location.pathname;

        switch (name.substring(1)) {
            case "movies":
                document.getElementById("movies").className = "nav-item active";
                document.getElementById("allMovies").className = "nav-item active";
                break;
            case "movies/add":
                document.getElementById("movies").className = "nav-item active";
                document.getElementById("addMovie").className = "nav-item active";
                break;
            case "subscriptions":
                document.getElementById("subscriptions").className = "nav-item active";
                document.getElementById("allMembers").className = "nav-item active";
                break;
            case "subscriptions/add":
                document.getElementById("subscriptions").className = "nav-item active";
                document.getElementById("addMember").className = "nav-item active";
                break;
            case "users":
                document.getElementById("userManagement").className = "nav-item active";
                document.getElementById("allUsers").className = "nav-item active";
                break;
            case "users/add":
                document.getElementById("userManagement").className = "nav-item active";
                document.getElementById("addUser").className = "nav-item active";
                break;
        }
    }

    function Start() {
        activateNavbar();
    }

    window.addEventListener("load", Start);
})();