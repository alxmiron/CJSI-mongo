'use strict';

angular.
  module('notifier').
  component('notifier', {
    controller: ['$scope', 'IsDBconnected',
      function NotifierCtrl($scope, IsDBconnected) {
        // types: success, info, warning, danger
        // codes: 1 - db connection failed
        //        2 - empty search result response
        const dbConnectionCode = 1;
        const emptyResult = 2;

        this.$onInit = () => {
          this.alerts = [];
          this.checkDBconnection();
        };

        $scope.$watch(
          scope => scope.$ctrl.notifyevents,
          (notifyevents) => {
            notifyevents.forEach(alert => {
              this.addAlert(alert.code, alert.code ? undefined : alert);
            });
          }
        );

        this.addAlert = (code, alert) => {
          if (alert) {
            this.alerts.push(alert);
            return;
          }
          switch (code) {
          case dbConnectionCode:
            this.alerts.push({
              msg: 'Connection to local database failed. Remote one will be used',
              type: 'warning',
              code: dbConnectionCode
            });
            break;
          case emptyResult:
            this.alerts.push({
              msg: 'Movies not found, sorry',
              type: 'danger',
              code: emptyResult
            });
            break;
          }
        };

        this.removeAlert = (code, index) => {
          if (index !== undefined) {
            this.alerts.splice(index, 1);
            return;
          }
          this.alerts.filter(a => a.code === code)
            .forEach((a, i) => this.removeAlert(code, i));
        };

        this.checkDBconnection = () => {
          IsDBconnected.get(res => {
            if (!res.dbconnected) {
              this.addAlert(1);
            } else {
              this.removeAlert(1);
            }
          });
        };
      }
    ],

    bindings: {
      notifyevents: '='
    },

    template: `
    <div class="container notifier-container">
      <div class="row">
        <div class="col-sm-6 col-sm-push-3">
          <div ng-repeat="(index, alert) in $ctrl.alerts" class="alert alert-{{alert.type}} notifier-alert text-center" role="alert">
            {{alert.msg}}
            <span class="glyphicon glyphicon-remove" aria-hidden="true" ng-click="$ctrl.removeAlert(null, index)"></span>
          </div>
        </div>
      </div>
    </div>
    `,
  });
