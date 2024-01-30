var express = require('express');
var router = express.Router();
const User = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
const { sendmail } = require("../utils/sendmail");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/menu', function (req, res, next) {
  res.render('menu');
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/review', function (req, res, next) {
  res.render('review');
});

router.get('/back', function (req, res, next) {
  res.redirect('/account');
});

router.get('/return', function (req, res, next) {
  res.redirect('/signin');
});





router.get('/signin', function (req, res, next) {
  res.render('signin');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});
router.get('/account', function (req, res, next) {
  res.render('account');
});






router.post("/signup", async function (req, res, next) {
  try {
    await User.register(
      { username: req.body.username, email: req.body.email },
      req.body.password
    );
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/menu",
    failureRedirect: "/signin",
    
  }),
  function (req, res, next) { }
);


router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/");
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
}


router.get('/forget', function (req, res, next) {
  res.render('forget')
})


router.post('/forget', async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      return res.send("user not found! ,<a href='/forget'>Try Again</a>")
    }
    await user.setPassword(req.body.newpassword)
    await user.save()
    res.redirect('/signin')
  } catch (error) {
    res.send(error)
  }
})


router.get('/reset', function (req, res, next) {
  res.render('reset', { admin: req.user })
})

router.post('/reset', isLoggedIn, async function (req, res, next) {
  try {
    await req.user.changePassword(
      req.body.oldpassword,
      req.body.newpassword,
    )
    await req.user.save()
    res.redirect('/profile')

  } catch (error) {
    res.send(error)
  }
})


router.post("/send-mail", async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.send("User Not Found! <a href='/forget'>Try Again</a>");

    sendmail(user.email, user, res, req);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});



module.exports = router;
