(function () {
    angular
        .module("WebAppMaker")
        .controller("widgetChooserController", widgetChooserController)
        .controller("widgetListController", widgetListController)
        .controller("widgetEditController", widgetEditController);

    function widgetListController($sce, $routeParams, WidgetService) {
        var model = this;

        model.userId = $routeParams['uid'];
        model.websiteId = $routeParams['wid'];
        model.pageId = $routeParams['pid'];
        model.widgetId = $routeParams['wgid'];

        model.getHtml = getHtml;
        model.getUrl = getUrl;
        model.getTemplate = getTemplate;

        function init() {
            WidgetService.findAllWidgetsForPage(model.pageId).then(
                function (data) {
                    model.widgets = data;
                }
            );
        }

        init();

        function getHtml(widget) {
            var html = $sce.trustAsHtml(widget.text);
            return html;
        }

        function getUrl(widget) {
            var urlParts = widget.url.split("/");
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }

        function getTemplate(widgetType) {
            var template = 'views/widget/template/widget-' + widgetType.toLowerCase() + '.view.client.html';
            return template;
        }
    }

    function widgetChooserController($location, $routeParams, WidgetService) {
        var model = this;

        model.userId = $routeParams['uid'];
        model.websiteId = $routeParams['wid'];
        model.pageId = $routeParams['pid'];
        model.widgetId = $routeParams['wgid'];
        model.createWidget = createWidget;

        function init() {
            WidgetService.findAllWidgetsForPage(model.pageId).then(
                function (data) {
                    model.widgets = data;
                }
            );
        }

        function createWidget(widgetType) {
            var widget = {
                name: "",
                widgetType: widgetType,
                pageId: model.pageId
            };
            WidgetService.createWidget(model.pageId, widget).then(
                function (response) {
                    var createdId = response.insertedIds[0];
                    $location.url('/user/' + model.userId + '/website/' + model.websiteId + '/page/' + model.pageId + '/widget/' + createdId);
                }
            );
        }

        init();
    }

    function widgetEditController($location, $routeParams, WidgetService) {
        var model = this;

        model.userId = $routeParams['uid'];
        model.websiteId = $routeParams['wid'];
        model.pageId = $routeParams['pid'];
        model.widgetId = $routeParams['wgid'];

        function init() {
            WidgetService.findWidgetById(model.widgetId).then(
                function(data) {
                    model.widget = data;
                }
            );
            WidgetService.findAllWidgetsForPage(model.pageId).then(
                function(data) {
                    model.widgets = data;
                }
            );
        }

        model.deleteWidget = deleteWidget;
        model.updateWidget = updateWidget;
        model.getTemplate = getTemplate;

        init();


        function getTemplate() {
            var template = 'views/widget/template/widget-' + model.widget.widgetType.toLowerCase() + '-edit.view.client.html';
            return template;
        }

        function deleteWidget() {
            WidgetService.deleteWidget(model.widgetId);
            $location.url('/user/' + model.userId + '/website/' + model.websiteId + '/page/' + model.pageId + /widget/);
        }

        function updateWidget() {
            var name = model.widget.name;
            var url = model.widget.url;
            if (name === "" || typeof name === "undefined" ) {
                model.error = "Please enter a name!";
                return;
            }

            WidgetService.updateWidget(model.widgetId, model.widget);
            $location.url('/user/' + model.userId + '/website/' + model.websiteId + '/page/' + model.pageId + /widget/);
        }
    }

})();