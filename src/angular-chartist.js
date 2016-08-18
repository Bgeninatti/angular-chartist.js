var chartistModule = angular.module('angular-chartist', []);
chartistModule.controller('AngularChartistCtrl', function($scope, $element) {

  $scope.options = $scope.chartOptions() || null;
  $scope.element = $element[0];
  $scope.$watch(function() {
    return {
      data: $scope.data,
      chartType: $scope.chartType,
      chartOptions: $scope.chartOptions(),
    };
  }, function(newConfig, oldConfig) {
    $scope.update(newConfig, oldConfig);
  }, true);

  $scope.$on('$destroy', function() {
    if ($scope.chart) {
      $scope.chart.detach();
    }
  });

  $scope.renderChart = function() {
    // ensure that the chart does not get created without data
    if ($scope.data) {
      $scope.chart = Chartist[$scope.chartType]($scope.element, $scope.data, $scope.options);
      return $scope.chart;
    }
  }

  $scope.update = function(newConfig, oldConfig) {
    // Update controller with new configuration
    $scope.chartType = newConfig.chartType;
    $scope.data = newConfig.data;
    $scope.options = newConfig.chartOptions;

    // If chart type changed we need to recreate whole chart, otherwise we can update
    if (!$scope.chart || newConfig.chartType !== oldConfig.chartType) {
      $scope.renderChart();
    } else {
      $scope.chart.update($scope.data, $scope.options);
    }
  }

  $scope.renderChart();
});

chartistModule.directive('chartist', function() {
  return {
    restrict: 'EA',
    scope: {
      // mandatory
      data: '=chartistData',
      chartType: '@chartistChartType',
      // optional
      chartOptions: '&chartistChartOptions',
    },
    controller: 'AngularChartistCtrl'
  };
})
