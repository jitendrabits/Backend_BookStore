const model = require('../model/db');
const Admin = model.admin;
const Users = model.users;
const encPassword = require('../middelware/enc-password');
const decPassword = require('../middelware/dec-password');
const createJwtToken = require('../middelware/create-jwt');

exports.getAdminDetails = (req, res, next) => {
    Admin.find().then(response => {
        const adminDetails = response[0];
        const adminData = {
            id: adminDetails._id,
            name: adminDetails.name,
            email: adminDetails.email,
            profile_image: adminDetails.profile_image,
        };
        res.status(200).send({
            message: "Admin Details fetched successfully",
            status: true,
            data: adminData
        });
    }).catch((err) => {
        res.status(400).send({
            message: "Something went wrong " + err.message,
            status: false,
            data: [],
        });
    });
};

exports.saveAdminDetails = async (req, res, next) => {
    // Check if request body contains user data
    const {email, password } = req.body;

    // Use request data if available, otherwise use hardcoded data
    const adminName = email || "DemoAdminUser";
    const adminEmail = email || "admin@gmail.com";
    const adminPassword = password ? await encPassword(password) : await encPassword("Test@123");
    const adminProfileImage = "";

    // Create a new Admin object
    const data = new Admin({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        profile_image: adminProfileImage,
    });

    // Save the admin data to the database
    data.save().then(response => {
        res.status(200).send({
            message: "Admin Created successfully",
            status: true,
            data: response
        });
    }).catch((err) => {
        res.status(400).send({
            message: "Something went wrong " + err.message,
            status: false,
            data: [],
        });
    });
};

exports.adminLogin = async (req, res, next) => {
    const data = req.body;

    if (data.email && data.password) {
        const loginEmail = { email: data.email };

        Admin.find(loginEmail).then(async response => {
            if (response.length > 0) {
                const adminDetails = response[0];
                const adminData = {
                    id: adminDetails._id,
                    name: adminDetails.name,
                    email: adminDetails.email,
                    profile_image: adminDetails.profile_image,
                };
                const checkPassword = await decPassword(data.password, adminDetails.password);

                if (checkPassword) {
                    const token = await createJwtToken(adminData);
                    res.status(200).send({
                        message: "Admin Login Successfully",
                        status: true,
                        data: adminData,
                        jwt_token: token,
                    });
                } else {
                    res.status(503).send({
                        message: "Please Enter Valid Password",
                        status: false,
                        data: [],
                    });
                }
            } else {
                res.status(503).send({
                    message: "Admin Not Exist. Please Enter Valid Email",
                    status: false,
                    data: [],
                });
            }
        }).catch((err) => {
            res.status(400).send({
                message: "Something went wrong " + err.message,
                status: false,
                data: [],
            });
        });
    } else {
        res.status(503).send({
            message: "Please Provide Email address & Password",
            status: false,
            data: [],
        });
    }
};

exports.getUsersList = async (req, res, next) => {
    let where = { status: 1 };
    try {
        const pageSize = 10;
        const page = req.query.pageNo || 0;
        let qry = Users.find(where).sort({ createdAt: -1 });

        if (page > 0) {
            qry = qry.skip(page * pageSize);
        }

        qry = qry.limit(pageSize);
        let userList = await qry;
        let dataCount = await Users.countDocuments(where);

        if (userList.length > 0) {
            res.status(200).send({
                message: "User List fetched successfully",
                status: true,
                data: userList,
                totalUsers: dataCount,
            });
        } else {
            res.status(300).send({
                message: "User List is Empty",
                status: true,
                data: []
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error " + err.message,
            status: false,
            data: [],
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const result = await Users.findByIdAndDelete(userId);

        if (result) {
            res.status(200).send({
                message: "User deleted successfully",
                status: true,
                data: result
            });
        } else {
            res.status(404).send({
                message: "User not found",
                status: false,
                data: []
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error " + err.message,
            status: false,
            data: [],
        });
    }
};
