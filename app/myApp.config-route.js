(function () {
    'use strict';

    angular
        .module('myApp')
        .config(uiRouteProviders);

    function uiRouteProviders($stateProvider, $urlRouterProvider) {
        const random = Math.random();
        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('root', {
            cache: false,
            abstract: true,
            url: '/',
            views: {
                '': {
                	templateUrl: 'app/views/dashboard/main.html?'+random
                }
            }
        })
        .state('root.main', {
            cache: false,
            url: 'main',
            views: {
                'headerIzq@root': {
                	templateUrl: 'app/views/assets/headerIzq.html?'+random,
                	controller: 'HeaderIzqController',
                    controllerAs: 'vm'
                },
                'headerDer@root': {
                	templateUrl: 'app/views/assets/headerDer.html?'+random,
                	controller: 'HeaderDerController',
                    controllerAs: 'vm'
                },
                'sideBar@root': {
                	templateUrl: 'app/views/assets/sidebar.html?'+random,
                	controller: 'SidebarController',
                    controllerAs: 'vm'
                },
                'container@root':{
                    templateUrl: 'app/views/tasks.html?'+random,
                    controller: 'TasksController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.main.task', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/tasks.html?'+random,
                    controller: 'TasksController',
                    controllerAs: 'vm'
                }
            },
            params: {'filter': ''}
        })
        .state('root.main.report', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/report/index.html?'+random,
                    controller: 'ReportController',
                    controllerAs: 'vm'
                }
            },
            params: {'wfp': '', 'wfh': '', 'name': '', 'from':'', 'order':'' }
        })
        .state('root.main.files', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/files/index.html?'+random,
                    controller: 'ReportController',
                    controllerAs: 'vm'
                }
            },
            params: {'wfp': '', 'wfh': '', 'name': '', 'from':'', 'order':'' }
        })
        .state('root.main.colaboration', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/colaboration/index.html?'+random,
                    controller: 'ReportController',
                    controllerAs: 'vm'
                }
            },
            params: {'wfp': '', 'wfh': '', 'name': '', 'from':'', 'order':'' }
        })
        .state('root.main.service', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/service.html?'+random,
                    controller: 'ServiceController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.main.documentcreate', {
            cache: false,
            views: {
                'headerDer@root': {
                	templateUrl: 'app/views/assets/headerDer.html?'+random,
                	controller: 'HeaderDerController',
                    controllerAs: 'vm'
                },
                'container@root':{
                    templateUrl: 'app/views/document/index.html?'+random,
                    controller: 'DocumentController',
                    controllerAs: 'vm'
                }
            },
            params: {'wfp': '', 'name': '', 'frmn': ''}
        })
        .state('root.main.documentopen', {
            cache: false,
            views: {
                'headerDer@root': {
                	templateUrl: 'app/views/assets/headerDer.html?'+random,
                	controller: 'HeaderDerController',
                    controllerAs: 'vm'
                },
                'container@root':{
                    templateUrl: 'app/views/document/index.html?'+random,
                    controller: 'DocumentController',
                    controllerAs: 'vm'
                }
            },
            params: {'nuDoc': '', 'nuInst': '', 'wfa': '', 'fromState':''}
        })
        .state('root.main.profile', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/sessions/profile/profile.html?'+random,
                    controller: 'ProfileController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.main.changeinfo', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/sessions/profile/change_info.html?'+random,
                    controller: 'ProfileController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.main.changepass', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/sessions/profile/change_pass.html?'+random,
                    controller: 'ProfileController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.main.changepassapro', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/sessions/profile/change_pass_apro.html?'+random,
                    controller: 'ProfileController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.main.changesecquest', {
            cache: false,
            views: {
                'container@root':{
                    templateUrl: 'app/views/sessions/profile/questions.html?'+random,
                    controller: 'ProfileController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.login', {
            cache: false,
            url: '',
            views:{
                'login@root':{
                    templateUrl: 'app/views/sessions/login.html?'+random,
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            },
            params: {'msg': ''}
        })
        .state('root.login.environment', {
            cache: false,
            url: ':environmentName',
            views:{
                'login@root':{
                    templateUrl: 'app/views/sessions/login.html?'+random,
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.login.forgot', {
            cache: false,
            views:{
                'login@root':{
                    templateUrl: 'app/views/sessions/forgot.html?'+random,
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.login.forgotsend', {
            cache: false,
            views:{
                'login@root':{
                    templateUrl: 'app/views/sessions/forgotSend.html?'+random,
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.login.question', {
            cache: false,
            views:{
                'login@root':{
                    templateUrl: 'app/views/sessions/question.html?'+random,
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.login.recuperate', {
            cache: false,
            views:{
                'login@root':{
                    templateUrl: 'app/views/sessions/recuperate.html?'+random,
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('root.login.primeravez',{
          cache: false,
          views: {
              'login@root':{
                  templateUrl: 'app/views/sessions/primeravez.html?'+random,
                  controller: 'LoginController',
                  controllerAs: 'vm'
              }
          }
        })
        .state('root.login.passwordexpired',{
          cache: false,
          views: {
              'login@root':{
                  templateUrl: 'app/views/sessions/passwordexpired.html?'+random,
                  controller: 'LoginController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.login.validquestion',{
          cache: false,
          views: {
              'login@root':{
                  templateUrl: 'app/views/sessions/validquestion.html?'+random,
                  controller: 'LoginController',
                  controllerAs: 'vm'
              },
            params: {'question': '' }
          }
        }).state('root.main.logs',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/logs/usuario.html?'+random,
                  controller: 'LogsController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.event',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/logs/evento.html?'+random,
                  controller: 'LogsController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.email',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/logs/email.html?'+random,
                  controller: 'LogsController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleAdmin',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/administrador.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleConf',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/configuracion.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleCorreo',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/correo.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleInter',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/dirInternet.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleFuente',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/fuenteDatos.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleInspec',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/inspeccion.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleRepfis',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/repFisico.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleSeg',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/seguridad.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        }).state('root.main.consoleVarCons',{
          cache: false,
          views: {
              'container@root':{
                  templateUrl: 'app/views/console/varConsultoria.html?'+random,
                  controller: 'ConsoleController',
                  controllerAs: 'vm'
              }
          }
        });
      }


})();
