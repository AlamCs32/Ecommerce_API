class Public {
    // Home Page No More use 
    static async HomePageApi(req, res) {
        let data = {
            title: "razy",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        // console.log(req.cookies("jwt"))
        return res.status(200).render("index", { data })
    }
    // Login Page
    static async LoginPage(req, res) {
        let data = {
            title: "Login Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("login", { data })
    }
    // Singup Page 
    static async SingupPage(req, res) {
        let data = {
            title: "singup Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("singup", { data })
    }
    static async ChangePasswdPage(req, res) {
        let data = {
            title: "singup Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("changePassword", { data })
    }
    static async ResetEmailPage(req, res) {
        let data = {
            title: "singup Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("ResetEmail", { data })
    }

    static async ResetPasswordPage(req, res) {
        let data = {
            title: "singup Page",
            field: req.flash("fields"),
            error: req.flash("AsynError"),
            message: req.flash("message")
        }
        return res.status(200).render("resetPassword", { data })
    }


}

module.exports = Public