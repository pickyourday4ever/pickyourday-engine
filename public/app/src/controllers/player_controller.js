angular.module('Application')
    .controller('PlayerCtrl', function($scope, CompanyService, $timeout){

    var PLAYER_TIME=5000;

    $scope.loading=true;
    $scope.data=[];
    var calendar=[];

    CompanyService.Pick().stats(function(res){
        calendar=res.data;
        $scope.data=_.clone(calendar[0]);
        $scope.loading=false; 
    });


    function animateCalendar(step,c, n, cb){
        console.log(step);
        var inter_array=c.reduce(function(prev,item, index){
            var c_pos=item.position;
            var n_pos=n[index].position;

            if(!_.isEqual(c_pos, n_pos)){

                var obj={
                    index:index,
                    current: {x: c_pos[0], y: c_pos[1],z: c_pos[2]},
                    next: {x: n_pos[0], y: n_pos[1],z: n_pos[2]}
                }

                prev.push(obj);

            }

            return prev;

        }, []);

        console.log(inter_array);
        if(inter_array.length>0){

            async.each(inter_array, function(item, callback){
                console.log(item);
                var tween = new TWEEN.Tween(item.current)
                .to(item.next, PLAYER_TIME)
                .onUpdate(function() {
                    var index=item.index;
                    var self=this;
                    
                    if(!$scope.$$phase){
                        $scope.$apply(function(){ 
                            $scope.data[index].position=[self.x, self.y, self.y];  
                        });
                    }
                    
                    console.log(this);
                    
                })
                .onComplete(callback)
                .start()
                }, function(){
                console.log("complete all");
                cb();
            });

        }else{
            $timeout(cb, PLAYER_TIME);
        }



    }



    $scope.play=function(){


        function iter(i){

            if(i<calendar.length-1){
                var current=calendar[i];
                var next=calendar[i+1];
                animateCalendar(i, current, next, function(){
                    iter(i+1);
                });

            }

        }

        iter(0);


    }

    requestAnimationFrame(InterpolationTime);


    function InterpolationTime(time) {

        requestAnimationFrame(InterpolationTime);
        TWEEN.update(time);


    }



});