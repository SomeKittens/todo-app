'use strict';

angular.module('TodoApp')
.directive('barChart', function($window) {
  return {
    restrict: 'A',
    scope: {
      tasks: '=tasks'
    },
    template: '<svg class="chart"></svg>',
    link: function(scope) {
      
      // General d3 stuff we want to do once
      var margin = { top: 20, right: 30, bottom: 30, left: 40 }
        , width = 960 - margin.left - margin.right
        , height = 500 - margin.top - margin.bottom
        , d3 = $window.d3;
        
      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
          .range([height, 0]);
          
      var chart = d3.select('.chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');
          
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');
      
      
      // Renders the graph
      var createGraph = function() {
        // Otherwise we'll be superimposing the new graph on the old one
        d3.select('svg g').selectAll('*').remove();
        
        // Data is in such a weird form to make grouped bars easier later on
        var data = [
          {
            category: 'Last Month',
            tasks: [
              {type: 'completed', count: 0}, {type: 'incomplete', count: 0}
            ]
          },
          {
            category: 'Last Week',
            tasks: [
              {type: 'completed', count: 0}, {type: 'incomplete', count: 0}
            ]
          },
          {
            category: 'This Week',
            tasks: [
              {type: 'completed', count: 0}, {type: 'incomplete', count: 0}
            ]
          }];
        
        // Now let's sort the data we've been given
        var now = new Date()
          , monthAgo = (new Date()).setMonth(now.getMonth() - 1)
          , twoWeeksAgo = (new Date()).setDate(now.getDate() - 14)
          , weekAgo = (new Date()).setDate(now.getDate() - 7);
          
        var taskIndexes = scope.tasks.$getIndex();
        taskIndexes.forEach(function(taskIdx) {
          var task = scope.tasks[taskIdx];
          task.created = new Date(task.created);
          if (task.completed) {
            if (task.created > weekAgo) {
              data[2].tasks[0].count++;
            } else if (task.created > twoWeeksAgo) {
              data[1].tasks[0].count++;
            } else if (task.created > monthAgo) {
              data[0].tasks[0].count++;
            }
          } else {
            if (task.created > weekAgo) {
              data[2].tasks[1].count++;
            } else if (task.created > twoWeeksAgo) {
              data[1].tasks[1].count++;
            } else if (task.created > monthAgo) {
              data[0].tasks[1].count++;
            }
          }
        });

        x.domain(data.map(function(d) { return d.category; }));
        x1.domain(['completed', 'incomplete']).rangeRoundBands([0, x.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return Math.max(d.tasks[0].count, d.tasks[1].count); })]);
        
        // Add axes
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
            
        chart.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
          .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Tasks');
        
        // Add bars
        var bar = chart.selectAll('.bar')
            .data(data)
          .enter().append('g')
            .attr('class', 'g')
            .attr('transform', function(d) { return 'translate(' + x(d.category) + ',0)'; });
          
        bar.selectAll('rect')
            .data(function(d) { return d.tasks; })
          .enter().append('rect')
            .attr('x', function(d) { return x1(d.type); })
            .attr('y', function(d) { return y(d.count); })
            .attr('height', function(d) { return height - y(d.count); })
            .attr('width', x1.rangeBand())
            .attr('fill', function(d) { return d.type === 'completed' ? '#39b3d7' : '#ed9c28'; });
            
        // What do those funny colors mean?
        var legend = chart.selectAll('.legend')
            .data(['Completed', 'Incomplete'])
          .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });
            
        legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', function(d) { return d === 'Completed' ? '#39b3d7' : '#ed9c28'; });
            
        legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(function(d) { return d; });
      };

      // Whenever the data is loaded or updated, rerender graph.
      scope.tasks.$on('loaded', createGraph);
      scope.tasks.$on('change', createGraph);
    }
  };
});