angular.
  module('moviesBlock').
  component('moviesBlock', {
    controller: ['$scope', '$log', 'localStorageService', 'Movies', 'Notifications', 'CONFIG',
      function MoviesBlockCtrl($scope, $log, localStorageService, Movies, Notifications, CONFIG) {
        this.$onInit = () => {
          this.currentView = {
            totalResults: 0,
            currentPage: 1,
            Search: []
          };
          this.setPagination();
        };

        $scope.$watch(
          Movies.getCurrentView,
          (newView) => {
            this.currentView = newView;
            if (this.currentView.Response == 'False') {
              Notifications.add(2);
            } else {
              if (this.currentView.remoteSourse == true) Notifications.add(3);
            }
            this.setPagination();
          }
        );

        this.setPagination = () => {
          this.pagination = [];
          let totalPages = Math.ceil(this.currentView.totalResults / CONFIG.moviesPerPage);
          let currentPage = this.currentView.currentPage;
          if (totalPages <= 1) return;
          for(let i = 0; i < totalPages; i++) {
            if (Math.abs(i - 1) > 4 &&
                Math.abs(i - currentPage) > 4 &&
                Math.abs(i - totalPages) > 4) continue;
            this.pagination.push({
              name: i+1,
              number: i+1,
              link: '#',
              active: currentPage === i+1
            });
          }
        };

        this.onPaginationClick = (event, page) => {
          event.preventDefault();
          if (!page) return;
          Movies.loadMovies(null, page.number);
        };

        this.onFavouritesAddClick = (event, movie) => {
          event.preventDefault();
          if (!movie) return;
          movie.isFavourite = !movie.isFavourite;
          localStorageService.set('favourites', this.favourites);
        };
      }
    ],

    bindings: {
      favourites: '='
    },

    template: `
      <search-block></search-block>

      <div class="container">

        <div class="row text-center">
          <div ng-repeat="movie in $ctrl.currentView.Search" class="movie-card col-sm-6 col-md-4 col-lg-3">
            <div class="thumbnail {{movie.isFavourite ? 'thumbnail-favourite' : ''}}" data-id="{{movie.imdbID}}">
              <a ui-sref="movieDetails({movieID: movie.imdbID})">
                <img ng-src="{{movie.Poster !== 'N/A' ? movie.Poster : 'http://placehold.it/280x390'}}" alt="{{movie.Title}}">
              </a>
              <div class="caption">
                <a ui-sref="movieDetails({movieID: movie.imdbID})">
                  <h3>{{movie.Title}}</h3>
                </a>
                <span class="badge">{{movie.Year}}</span>
                <span class="badge">{{movie.Type}}</span>
                <button class="btn btn-default btn-favourite" type="button" ng-click="$ctrl.onFavouritesAddClick($event, movie)">
                  <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                  <span class="btn-favourite-text btn-favourite-text-add">Add to favourites</span>
                  <span class="btn-favourite-text btn-favourite-text-remove">Remove from favourites</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav class="text-center" aria-label="Page navigation">
          <ul class="pagination" ng-click="$ctrl.onPaginationClick($event)">
            <li ng-repeat="page in $ctrl.pagination" class="{{page.active ? 'active' : ''}}">
              <a href="#" ng-click="$ctrl.onPaginationClick($event, page)">{{page.name}}</a>
            </li>
          </ul>
        </nav>

      </div>
    `,
  });
