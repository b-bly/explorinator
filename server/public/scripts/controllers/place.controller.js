myApp.controller('PlaceController', ['UserService', 'PlacesService', '$mdDialog', '$mdToast', 'NgMap', function (UserService, PlacesService, $mdDialog, $mdToast, NgMap) {
  console.log('InfoController created');
  var self = this;
  self.userService = UserService;

  self.placesArray = PlacesService.placesArray;
  self.markerArray = PlacesService.markerArray;
  self.placeToAdd = {}
  self.placeToEdit = PlacesService.placeToEdit;
  self.map = {};
  self.categories = UserService.categories;
  self.newCat = "";


  //initialize map
  NgMap.getMap('map').then(function (map) {
    self.map = map;
  })

  //clears data on logout
  self.logout = function () {
    UserService.logout();
    PlacesService.markerArray = [];
    PlacesService.placesArray = { list: [] };
  }

  //main map controls

  self.updateMap = function () { //get data from server
    PlacesService.getPlaces();
    console.log('categories in PC ', self.categories)
  }

  self.showInfoWindow = function (e, place) {
    self.place = place;
    self.editPlace = place;
    self.placeToShow = place;
    self.map.showInfoWindow('infoWindow', this);
  }

  self.showDetails = function (place) {
    console.log('place is ', place)
    console.log('self.place is', self.place)
    PlacesService.detailsData(self.place);
    console.log('place clicked', self.placeToShow)
    $mdDialog.show({
      controller: 'PlaceController',
      controllerAs: 'pc',
      templateUrl: 'views/templates/details.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: { place: self.placeToShow },
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };


  //edit place controls

  self.showEdit = function (place) { //why am i passing place here
    PlacesService.editData(self.place); //and self.place here?
    $mdDialog.show({
      controller: 'PlaceController',
      controllerAs: 'pc',
      templateUrl: 'views/templates/edit.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: self.place,
      locals: { place: self.placeToEdit },
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };

  self.updatePlace = function (place) { // call service method to update data
    //was this to control the box on the DOM before material? self.editMode = false;
    self.place = place; //what is this doing

    // console.log('new data for place is ', place)
    // console.log('updatePlace: place is ', place)
    // console.log('updatePlace: self.place is ', self.place)
    // console.log('updatePlace, self.placeToEdit is ', self.placeToEdit)
    if (self.newCat != "") {
      console.log(self.newCat)
      UserService.addCat(self.newCat);
      //call function to add category to db (on check??)
      self.placeToEdit.category = self.newCat;
    }
    self.newCat = "";
    PlacesService.updatePlace(place); //has to be place or it breaks *shrug*
    //self.showDetail();
  }

  self.makeFave = function (place) { //call service method to PUT type change
    // console.log('controller gets type change requested for', place);
    PlacesService.makeFave(place);
  }

  //edit mode in material
  self.showEdit = function (place) {
    PlacesService.editData(self.place);
    $mdDialog.show({
      controller: 'PlaceController',
      controllerAs: 'pc',
      templateUrl: 'views/templates/edit.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: self.place,
      locals: { place: self.placeToEdit },
      clickOutsideToClose: true,
      fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };

  //new place controls
  self.showInputs = function () { //shows inputs after location is pulled from Places API
    self.partTwo = true;
  }

  self.placeChanged = function () {
    self.place = this.getPlace();
    self.placeToAdd = this.getPlace();
    console.log('self.place', self.place)

    console.log(self.place.geometry.location.lat(), self.place.geometry.location.lng());
    self.placeToAdd.lat = self.place.geometry.location.lat();
    self.placeToAdd.lng = self.place.geometry.location.lng();
    //console.log('location', self.place.geometry.location);
    // self.map.setCenter(self.place.geometry.location);
  }

  self.addPlace = function () { //calls service method to POST new place to db, clears place inputs
    if (self.newCat != "") {
      console.log(self.newCat)
      UserService.addCat(self.newCat);
      self.placeToAdd.category = self.newCat;
    }
    PlacesService.addPlace(self.placeToAdd);
    self.placeToAdd = {};
    self.place = {};
    self.address = "";
    self.newCat = "";
  }


  //delete place controls
  self.deletePlace = function (place) {
    PlacesService.deletePlace(place);
    self.hideDetail();
  }

  //filestack controls
  self.client = filestack.init('A2o83QviQ7GRKGiIDPkUOz');
  self.showPicker = function () {
    client.pick({
    }).then(function (result) {
      console.log(JSON.stringify(result.filesUploaded))
    });
  }

  //marker init
  self.updateMap();



}]);

