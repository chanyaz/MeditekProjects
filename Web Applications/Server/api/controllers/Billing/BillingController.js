module.exports = {
    CreateBilling: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
    },
    ReadBilling: function(req, res) {},
    UpdateBilling: function(req, res) {},
    DestroyBilling: function(req, res) {},
    AddItem: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            return res.badRequest("data failed");
        } else {
            Services.AddItem(data, req.user)
                .then(function(success) {
                    res.ok(success.data);
                }, function(err) {
                    res.serverError(err.error);
                });
        }
    }
};
