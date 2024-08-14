const path = require('path');
const express = require('express'); 
const ejs = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const notifier = require('node-notifier');
const multer  = require('multer');

var AppNo;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        let nm = file.originalname;
        let ext = nm.substr(nm.lastIndexOf('.'));
        if(ext !=='.pdf'){
            ext = ".png";
        }
        cb(null, AppNo+file.fieldname+ext);
    }
  })

const upload = multer({ storage:storage });

const db = mysql.createConnection({
    host: '127.0.0.1',
    database: 'faculty_recruitment',
    user: 'root',
    password: 'Pass@123'
});

db.connect(function(error){
    if(error){
        throw error;
    }
    else{
        console.log("Database connected");
    }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));


var Username,Department,Position,
F_Name,M_Name,L_Name,DOB,Gender,Nationality,ID_type,ID_no,Category,Email,Mobile_no,Add_l1,Add_l2,City,State,Pincode,
phd_uni,phd_Dept,phd_sn,phd_dos,phd_yoj,phd_title,
pg_uni,pg_deg,pg_bra,pg_yoj,pg_yoc,pg_dur,pg_per,pg_div,
ug_uni,ug_deg,ug_bra,ug_yoj,ug_yoc,ug_dur,ug_per,ug_div,
add_uni=[],add_deg=[],add_bra=[],add_yoj=[],add_yoc=[],add_dur=[],add_per=[],add_div=[],cnt_ae = 0,
Eh_Position=[],Eh_Organisation=[],Eh_DOJ=[],Eh_DOL=[],EmpHis=[],Eh_DOJi=[],Eh_DOLi=[],
Rs_Name=[],Rs_Degree=[],Rs_Title=[],Rs_Status=[],Rs_DOS=[],Rs_DOC=[],ResSup,
Aw_Name=[],Aw_Presentor=[],Aw_Year=[],Aw,
Rso_Name=[],Rso_Status=[],Rso,
res_con,tea_con,pro_ser,por_add,
nij,nic,nnj,nnc,n_p,n_b,Ps={inter_journals:4},
Pt,Pt_inventor=[],Pt_title=[],Pt_DOF=[],Pt_DOP=[],Pt_number=[],Pt_status=[],Pt_DOFi=[],Pt_DOPi=[],
Pb,Pb_type=[],Pb_title=[],Pb_type=[],Pb_author=[],Pb_YOP=[],Pb_docid=[],
d_phd,d_pg,d_ug,d_12,d_10,d_add,d_pro,d_sig,
cnt10,cnt2,cnt3,cnt4,cnt5,cnt6
;


//Sign IN Page <----------------------------------------------------------------------------->

app.get("/",function(req,res){
    res.render("index");
});

app.post("/",function(req,res){
    let SignUp = req.body.SignUp;
    if(SignUp == "SignUp"){
        res.redirect("/SignUp");
        return;
    }
    let Emailt=req.body.Email;
    let Password=req.body.Password;
    query = 'Select * from applications WHERE Email="'+Emailt+'" AND Password="'+Password+'";'
    db.query(query,function(err,result,field){
        if(result.length>0){
            AppNo = result[0].Application_Number;
            Username=result[0].Username;
            Department = result[0].Department;
            Position = result[0].Post;
            res.redirect("/form1");
        }
        else{
            notifier.notify({
                title : "Alert",
                message: "Incorrect Email or Password"
            });
            res.redirect("/");
        }
    });
});

//<------------------------------------------------------------------->


//Sign UP <----------------------------------------------------------->

app.get("/SignUp",function(req,res){
    res.render("signup")
});

app.post("/SignUp",function(req,res){
    Username = req.body.Username;
    let email = req.body.Email;
    let password = req.body.Password;
    let RePassword = req.body.RePassword;
    Department = req.body.Department;
    Position = req.body.Position;
    if(password === RePassword){
        query = 'INSERT INTO applications (Email,Password,Post,Department,Username) VALUES ("' + email + '","' + password + '","' + Position + '","' + Department + '","' + Username + '");';
        db.query(query,function(err,result,fields){
            if(err) throw err;
        });
        res.redirect("/");
        return;
    }
    else{
        notifier.notify({
            title : "Alert",
            message: "The Re-entered Password does not match"
        });
        res.redirect("/SignUp");
        return;
    }
});

//<-------------------------------------------------------------------->


//Form Page 1 <--------------------------------------------------------->

app.get("/form1", function(req, res) {
    const query = 'SELECT * FROM personal_info WHERE Application_Number = "' + AppNo + '";';

    new Promise((resolve, reject) => {
        db.query(query, function(err, result, field) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
    .then(result => {
        if (result.length > 0) {
            F_Name = result[0].First_Name;
            M_Name = result[0].Middle_Name;
            L_Name = result[0].Last_Name;
            DOB = result[0].DOB;
            DOB = DOB.toISOString().split("T")[0];
            Gender = result[0].Gender;
            Nationality = result[0].Nationality;
            ID_type = result[0].ID_type;
            ID_no = result[0].ID_number;
            Category = result[0].Category;
            Email = result[0].Email;
            Mobile_no = result[0].MobileNumber;
            Add_l1 = result[0].AddressLine1;
            Add_l2 = result[0].AddressLine2;
            City = result[0].City;
            State = result[0].State;
            Pincode = result[0].Pincode;
        }
    })
    .then(() => {
        res.redirect("/form1f");
    })
    
});


app.get("/form1f",function(req,res){
    res.render("form1",{Username:Username,AppNo:AppNo,F_Name : F_Name,M_Name:M_Name,L_Name:L_Name,DOB:DOB,Gender:Gender,Nationality:Nationality,ID_type:ID_type,
        ID_no:ID_no,Category:Category,Email:Email,Mobile_no:Mobile_no,Add_l1:Add_l1,Add_l2:Add_l2,City:City,State:State,Pincode:Pincode,Department:Department,Position:Position});
});

app.post("/form1f",function(req,res){
    F_Name = req.body.F_Name;
    M_Name = req.body.M_Name;
    L_Name = req.body.L_Name;
    DOB = req.body.DOB;
    Gender = req.body.Gender;
    Nationality = req.body.Nationality;
    ID_type = req.body.ID_type;
    ID_no = req.body.ID_no;
    Category = req.body.Category;
    Email = req.body.Email;
    Mobile_no = req.body.Mobile_no;
    Add_l1 = req.body.Add_l1;
    Add_l2 = req.body.Add_l2;
    City = req.body.City;
    State = req.body.State;
    Pincode = req.body.Pincode;
    Department = req.body.Department;
    Position = req.body.Position;
    query = 'DELETE FROM personal_info WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});


    query = 'INSERT INTO personal_info VALUES ("'+ AppNo + '","'  + F_Name + '","' + M_Name + '","' + L_Name + '","' + DOB + '","' + Gender + '","' + 
            Nationality + '","' + ID_type + '","' + ID_no + '","' + Category + '","' + Email + '","' + Mobile_no + '","' + Add_l1 + '","' + Add_l2 + '","' + City + '","' + State + '","' + Pincode + '");';
    db.query(query,function(err,result,field){});


    query= 'UPDATE applications SET Department = "'+Department+'", Post = "'+Position+'" WHERE Application_Number = "'+AppNo+'";';
    db.query(query,function(err,result,field){
    });
    res.redirect("/form2");
});

//<---------------------------------------------------------------------->

//Form Page 2 <---------------------------------------------------------->

function queryDB(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql,function(err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.get("/form2", async function(req,res){

    try{
        const PhDr = await queryDB('SELECT * FROM phd WHERE Application_Number = "' + AppNo + '";');
        if(PhDr.length>0){
            phd_uni=PhDr[0].University;
            phd_Dept = PhDr[0].Department;
            phd_sn = PhDr[0].Supervisior_Name;
            phd_dos = PhDr[0].Date_Of_Success;
            phd_dos = phd_dos.toISOString().split("T")[0];
            phd_yoj = PhDr[0].Year_Of_Joining;
            phd_title = PhDr[0].Title;
        }

        const pgr = await queryDB('SELECT * FROM pg WHERE Application_Number = "' + AppNo + '";');
        if(pgr.length>0){
            pg_uni=pgr[0].University;
            pg_deg=pgr[0].Degree;
            pg_bra=pgr[0].Branch;
            pg_yoj=pgr[0].Year_Of_Joining;
            pg_yoc=pgr[0].Year_Of_Completion;
            pg_dur=pgr[0].Duration;
            pg_per=pgr[0].Percentage;
            pg_div=pgr[0].Division;
        }

        const ugr = await queryDB('SELECT * FROM ug WHERE Application_Number = "' + AppNo + '";');
        if(ugr.length>0){
            ug_uni=ugr[0].University;
            ug_deg=ugr[0].Degree;
            ug_bra=ugr[0].Branch;
            ug_yoj=ugr[0].Year_Of_Joining;
            ug_yoc=ugr[0].Year_Of_Completion;
            ug_dur=ugr[0].Duration;
            ug_per=ugr[0].Percentage;
            ug_div=ugr[0].Division;
        }

        const aedur = await queryDB('SELECT * FROM edu_add WHERE Application_Number = "' + AppNo + '";');
        if(aedur.length>0){
            cnt_ae = aedur.length;
            add_uni=[];add_deg=[];add_bra=[];add_yoj=[];add_yoc=[];add_dur=[];add_per=[];add_div=[];
            for(let i =0;i<aedur.length;i++){
                add_uni[i]=aedur[i].University;
                add_deg[i]=aedur[i].Degree;
                add_bra[i]=aedur[i].Branch;
                add_yoj[i]=aedur[i].Year_Of_Joining;
                add_yoc[i]=aedur[i].Year_Of_Completion;
                add_dur[i]=aedur[i].Duration;
                add_per[i]=aedur[i].Percentage;
                add_div[i]=aedur[i].Division;
            }
        }

        res.redirect("/form2f");

    }
    catch(error){
        console.error("Error fetching data:", error);
    }

});

app.get("/form2f",function(req,res){
    res.render("form2",{Username:Username,AppNo:AppNo,
        phd_uni:phd_uni,phd_Dept:phd_Dept,phd_sn:phd_sn,phd_dos:phd_dos,phd_yoj:phd_yoj,phd_title:phd_title,
        pg_uni:pg_uni,pg_deg:pg_deg,pg_bra:pg_bra,pg_yoj:pg_yoj,pg_yoc:pg_yoc,pg_dur:pg_dur,pg_per:pg_per,pg_div:pg_div,
        ug_uni:ug_uni,ug_deg:ug_deg,ug_bra:ug_bra,ug_yoj:ug_yoj,ug_yoc:ug_yoc,ug_dur:ug_dur,ug_per:ug_per,ug_div:ug_div,
        add_uni:add_uni,add_deg:add_deg,add_bra:add_bra,add_yoj:add_yoj,add_yoc:add_yoc,add_dur:add_dur,add_per:add_per,add_div:add_div,cnt_ae:cnt_ae
    });
});

app.post("/form2f",function(req,res){
    phd_uni = req.body.phd_uni;
    phd_Dept = req.body.phd_Dept;
    phd_sn = req.body.phd_sn;
    phd_dos = req.body.phd_dos;
    phd_yoj = req.body.phd_yoj;
    phd_title = req.body.phd_title;

    pg_uni=req.body.pg_uni;
    pg_deg=req.body.pg_deg;
    pg_bra=req.body.pg_bra;
    pg_yoj=req.body.pg_yoj;
    pg_yoc=req.body.pg_yoc;
    pg_dur=req.body.pg_dur;
    pg_per=req.body.pg_per;
    pg_div=req.body.pg_div;

    ug_uni=req.body.ug_uni;
    ug_deg=req.body.ug_deg;
    ug_bra=req.body.ug_bra;
    ug_yoj=req.body.ug_yoj;
    ug_yoc=req.body.ug_yoc;
    ug_dur=req.body.ug_dur;
    ug_per=req.body.ug_per;
    ug_div=req.body.ug_div;

    add_uni=req.body.add_uni;
    add_deg=req.body.add_deg;
    add_bra=req.body.add_bra;
    add_yoj=req.body.add_yoj;
    add_yoc=req.body.add_yoc;
    add_dur=req.body.add_dur;
    add_per=req.body.add_per;
    add_div=req.body.add_div;

    query = 'DELETE FROM phd WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    query = 'INSERT INTO phd VALUES ("'+AppNo +'","'+ phd_Dept +'","'+ phd_uni+'","'+phd_sn+'","'+phd_yoj+'","'+phd_dos+'","'+phd_title+'");';
    db.query(query,function(err,result,field){
    });

    query = 'DELETE FROM pg WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    query = 'INSERT INTO pg VALUES ("'+AppNo +'","'+ pg_uni +'","'+ pg_deg +'","'+ pg_bra +'","'+ pg_yoj +'","'+ pg_yoc +'","'+ pg_dur +'","'+ pg_per +'","'+ pg_div+'");';
    db.query(query,function(err,result,field){});

    query = 'DELETE FROM ug WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    query = 'INSERT INTO ug VALUES ("'+AppNo +'","'+ ug_uni +'","'+ ug_deg +'","'+ ug_bra +'","'+ ug_yoj +'","'+ ug_yoc +'","'+ ug_dur +'","'+ ug_per +'","'+ ug_div+'");';
    db.query(query,function(err,result,field){});

    query = 'DELETE FROM edu_add WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    // console.log(add_uni.length);
    
    if(typeof(add_uni)=='string'){
        let temp = [add_uni];
        add_uni=temp;
        temp = [add_deg];
        add_deg=temp;
        temp = [add_bra];
        add_bra=temp;
        temp = [add_yoj];
        add_yoj=temp;
        temp = [add_yoc];
        add_yoc=temp;
        temp = [add_dur];
        add_dur=temp;
        temp = [add_per];
        add_per=temp;
        temp = [add_div];
        add_div=temp;
    }
    let nf = 0;
    if(add_uni !== undefined) nf = add_uni.length;
    cnt_ae = nf;
    for(let i = 0;i<nf;i++){

        query = 'INSERT INTO edu_add VALUES ("'+AppNo +'","'+ add_uni[i] +'","'+ add_deg[i] +'","'+ add_bra[i] +'","'+ add_yoj[i] +'","'+ add_yoc[i] +'","'+ add_dur[i] +'","'+ add_per[i] +'","'+ add_div[i]+'");';
        db.query(query,function(err,result,field){});

    }
    
    res.redirect("/form3");
});

//<----------------------------------------------------------------------->

//Form Page 3 <---------------------------------------------------------->
app.get("/form3",function(req,res){
    Promise.all([
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM employment_history WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    EmpHis=result;
                    // console.log(EmpHis);
                    for(let i=0;i<result.length;i++){
                        Eh_Position[i]=result[i].Position;
                        Eh_Organisation[i]=result[i].Organisation;
                        Eh_DOJi[i]=result[i].Date_Of_Joining;
                        Eh_DOJ[i]=Eh_DOJi[i].toISOString().split("T")[0];
                        Eh_DOLi[i]=result[i].Date_Of_Leaving;
                        Eh_DOL[i]=Eh_DOLi[i].toISOString().split("T")[0];
                    }
                    
                    
                }
                else{
                    EmpHis=[];
                }
                // console.log(Eh_Position,Eh_Organisation,Eh_DOJ,Eh_DOL);
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM research_supervision WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    ResSup=result;
                    for(let i=0;i<result.length;i++){
                    Rs_Name[i]=result[i].name_of_student;
                    Rs_Degree[i]=result[i].student_degree;
                    Rs_Title[i]=result[i].title;
                    Rs_Status[i]=result[i].status;
                    Rs_DOS[i]=result[i].starting_year;
                    Rs_DOC[i]=result[i].completion_year;
                    }
                }
                else{
                    ResSup=[];
                }
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM awards WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    Aw=result;
                    for(let i=0;i<result.length;i++){
                    Aw_Name[i]=result[i].Award_Name;
                    Aw_Presentor[i]=result[i].Presenter;
                    Aw_Year[i]=result[i].Year;
                    }
                }
                else{
                    Aw=[];
                }
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM professional_society WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result==undefined){
                    Rso=result;
                    for(let i=0;i<result.length;i++){
                    Rso_Name[i]=result[i].name;
                    Rso_Status[i]=result[i].membership_status;
                    }
                }
                else{
                    Rso=result;
                }
                resolve();
            });
        })
    ]).then(() => {
        res.redirect("/form3f");
    });
});


app.get("/form3f",function(req,res){
    res.render("form3",{AppNo:AppNo,Username:Username,EmpHis:EmpHis,ResSup:ResSup,Aw:Aw,Rso:Rso,Eh_Position:Eh_Position,Eh_Organisation:Eh_Organisation,Eh_DOJ:Eh_DOL,Eh_DOL:Eh_DOL,
        Rs_Name:Rs_Name,Rs_DOC:Rs_DOC,Rs_DOS:Rs_DOS,Rs_Degree:Rs_Degree,Rs_Status:Rs_Degree,Rs_Status:Rs_Status,Rs_Title:Rs_Title,Aw_Name:Aw_Name,Aw_Presentor:Aw_Presentor,Aw_Year:Aw_Year,Rso_Name:Rso_Name,Rso_Status:Rso_Status
    });
});

app.post("/form3f",function(req,res){
    Eh_Position=req.body.Eh_Position;
    Eh_Organisation=req.body.Eh_Organisation;
    Eh_DOJ=req.body.Eh_DOJ;
    Eh_DOL=req.body.Eh_DOL;
    Rs_Name =req.body.Rs_Name;
    Rs_Degree =req.body.Rs_Degree;
    Rs_Title =req.body.Rs_Title;
    Rs_Status =req.body.Rs_Status;
    Rs_DOC =req.body.Rs_DOC;
    Rs_DOS =req.body.Rs_DOS;
    Aw_Name =req.body.Aw_Name;
    Aw_Presentor =req.body.Aw_Presentor;
    Aw_Year =req.body.Aw_Year;
    Rso_Name =req.body.Rso_Name;
    Rso_Status =req.body.Rso_Status;
    query = 'DELETE FROM employment_history WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});
    
    // console.log(Eh_Position, Eh_Organisation,Eh_DOJ,Eh_DOL);
    if(typeof(Eh_Position)=='string'){
        let temp = [Eh_DOJ];
        Eh_DOJ = temp;
        temp = [Eh_DOL];
        Eh_DOL = temp;
        temp = [Eh_Position];
        Eh_Position = temp;
        temp = [Eh_Organisation];
        Eh_Organisation = temp;
        // query = 'INSERT INTO employment_history VALUES ("'+AppNo+'","'+Eh_Position+'","'+Eh_Organisation+'","'+Eh_DOJ+'","'+Eh_DOL+'");';
        // db.query(query,function(err,result,field){});
    }

    var cnt10 = 0;
    if(Eh_Position !== undefined) cnt10 = Eh_Position.length;
    
    for(let i=0; i<cnt10;i++){
        query = 'INSERT INTO employment_history VALUES ("'+AppNo+'","'+Eh_Position[i]+'","'+Eh_Organisation[i]+'","'+Eh_DOJ[i]+'","'+Eh_DOL[i]+'");';
        db.query(query,function(err,result,field){});
    }
    
    query = 'DELETE FROM research_supervision WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    
    // console.log(Rs_Name,Rs_Degree,Rs_DOC);
    if(typeof(Rs_Name)=='string'){
        let temp = [Rs_Name];
        Rs_Name =temp;
        temp = [Rs_Degree];
        Rs_Degree =temp;
        temp = [Rs_Title];
        Rs_Title =temp;
        temp = [Rs_Status];
        Rs_Status =temp;
        temp = [Rs_DOC];
        Rs_DOC =temp;
        temp = [Rs_DOS];
        Rs_DOS =temp;
    }

    cnt2=0;
    if(Rs_Name !== undefined) cnt2 = Rs_Name.length;
    for(let i=0; i<cnt2;i++){
        query = 'INSERT INTO research_supervision VALUES ("'+AppNo+'","'+Rs_Name[i]+'","'+Rs_Degree[i]+'","'+Rs_Title[i]+'","'+Rs_Status[i]+'","'+Rs_DOS[i]+'","'+Rs_DOC[i]+'");';
        db.query(query,function(err,result,field){});
    }
    
    query = 'DELETE FROM awards WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    if(typeof(Aw_Name)=='string'){
        temp = [Aw_Name];
        Aw_Name =temp;
        temp = [Aw_Presentor];
        Aw_Presentor =temp;
        temp = [Aw_Year];
        Aw_Year =temp;
    }
    
    cnt3=0;
    if(Aw_Name !== undefined) cnt3 = Aw_Name.length;

    for(let i=0; i<cnt3;i++){
        query = 'INSERT INTO awards VALUES ("'+AppNo+'","'+Aw_Name[i]+'","'+Aw_Presentor[i]+'","'+Aw_Year[i]+'");';
        db.query(query,function(err,result,field){});
    }



    query = 'DELETE FROM professional_society WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    
    
    if(typeof(Rso_Name)=='string'){
        temp = [Rso_Name];
        Rso_Name =temp;
        temp = [Rso_Status];
        Rso_Status =temp;
    }

    // console.log(Rso_Name);

    cnt4=0;
    if(Rso_Name !== undefined) cnt4 = Rso_Name.length;
    for(let i=0; i<cnt4;i++){
        query = 'INSERT INTO professional_society VALUES ("'+AppNo+'","'+Rso_Name[i]+'","'+Rso_Status[i]+'");';
        db.query(query,function(err,result,field){});
    }
    
    res.redirect("/form4");
});

// ------------------------------------------------------------

// Form page 4 --------------------------------------------------------------------

app.get("/form4",function(req,res){
    Promise.all([
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM publication_summary WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    Ps=result[0];
                    nij=result[0].inter_journals;
                    nic=result[0].inter_conference;
                    nnj=result[0].nat_journals;
                    nnc=result[0].nat_conference;
                    n_p=result[0].no_Of_patents;
                    n_b=result[0].no_of_books;
                }
                else{
                    Ps=[];
                }
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM publications WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    Pb=result;
                    for(let i=0;i<result.length;i++){
                        Pb_author[i]=result[i].author;
                        Pb_docid[i]=result[i].document_id;
                        Pb_YOP[i]=result[i].year_of_publication;
                        Pb_title[i]=result[i].title;
                        Pb_type[i]=result[i].type;
                    }
                }
                else{
                    Pb=[];
                }
                resolve();
            });
        }),
        new Promise((resolve, reject) => {
            query = 'SELECT * FROM patents WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    Pt=result;
                    for(let i=0;i<result.length;i++){
                        Pt_DOFi[i]=result[i].date_of_filings;
                        Pt_DOF[i]=Pt_DOFi[i].toISOString().split("T")[0];
                        Pt_DOPi[i]=result[i].daye_of_publication;
                        Pt_DOP[i]=Pt_DOPi[i].toISOString().split("T")[0];
                        Pt_inventor[i]=result[i].inventer;
                        Pt_number[i]=result[i].patent_number;
                        Pt_status[i]=result[i].status;
                        Pt_title[i]=result[i].title;
                    }
                }
                else{
                    Pt=[];
                }
                resolve();
            });
        })
    ]).then(() => {
        res.redirect("/form4f");
    });
});


app.get("/form4f",function(req,res){
    res.render("form4",{AppNo:AppNo,Username:Username,Pb:Pb,Ps:Ps,Pt:Pt,nij:nij,nic:nic,nnj:nnj,nnc:nnc,n_p:n_p,n_b,n_b,Pb_YOP:Pb_YOP,Pb_author:Pb_author,
        Pb_docid:Pb_docid,Pb_title:Pb_title,Pb_type:Pb_type,Pt_DOF:Pt_DOF,Pt_DOP:Pt_DOP,Pt_inventor:Pt_inventor,Pt_number:Pt_number,Pt_status:Pt_status,Pt_title:Pt_title
    });
});

app.post("/form4f",function(req,res){
    nij=req.body.nij;
    nic=req.body.nic;
    nnj=req.body.nnj;
    nnc=req.body.nnc;
    n_p=req.body.n_p;
    n_b=req.body.n_b;
    Pt_inventor=req.body.Pt_inventor;
    Pt_title=req.body.Pt_title;
    Pt_DOF=req.body.Pt_DOF;
    Pt_DOP=req.body.Pt_DOP;
    Pt_number=req.body.Pt_number;
    Pt_status=req.body.Pt_status;
    Pb_type = req.body.Pb_type;
    Pb_title = req.body.Pb_title;
    Pb_author = req.body.Pb_author;
    Pb_YOP = req.body.Pb_YOP;
    Pb_docid = req.body.Pb_docid;
    // console.log(Pt_inventor);
    query ='DELETE FROM publication_summary WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});
        query = 'INSERT INTO publication_summary VALUES ("'+AppNo+'","'+nij+'","'+nic+'","'+nnj+'","'+nnc+'","'+n_p+'","'+n_b+'");';
        db.query(query,function(err,result,field){});

    
    query = 'DELETE FROM patents WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});


    
    if(typeof(Pt_inventor)=='string'){
        temp = [Pt_inventor];
        Pt_inventor=temp;
        temp = [Pt_title];
        Pt_title=temp;
        temp = [Pt_DOF];
        Pt_DOF=temp;
        temp = [Pt_DOP];
        Pt_DOP=temp;
        temp = [Pt_number];
        Pt_number=temp;
        temp = [Pt_status];
        Pt_status=temp;
    }

    cnt5=0;
    if(Pt_inventor !== undefined) cnt5 = Pt_inventor.length;
    for(let i=0; i<cnt5;i++){
        query = 'INSERT INTO patents VALUES ("'+AppNo+'","'+Pt_inventor[i]+'","'+Pt_title[i]+'","'+Pt_DOF[i]+'","'+Pt_DOP[i]+'","'+Pt_number[i]+'","'+Pt_status[i]+'");';
        db.query(query,function(err,result,field){});
    }
    
    query = 'DELETE FROM publications WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,field){});

    
    if(typeof(Pb_type)=='string'){
        temp=[Pb_type];
        Pb_type = temp;
        temp=[Pb_title];
        Pb_title = temp;
        temp=[Pb_author];
        Pb_author = temp;
        temp=[Pb_YOP];
        Pb_YOP = temp;
        temp=[Pb_docid];
        Pb_docid = temp;
    }
    
    cnt6=0;
    if(Pb_type !== undefined) cnt6= Pb_type.length;
    for(let i=0; i<cnt6;i++){
        query = 'INSERT INTO publications VALUES ("'+AppNo+'","'+Pb_type[i]+'","'+Pb_author[i]+'","'+Pb_title[i]+'","'+Pb_YOP[i]+'","'+Pb_docid[i]+'");';
        db.query(query,function(err,result,field){});
    }
    
    res.redirect("/form5");
});

// --------------------------------------------------------9----------------

//Form Page 5 <------------------------------------------------------------------->

app.get("/form5",function(req,res){
    Promise.all([
        new Promise((resolve,reject) =>{
            query = 'SELECT * FROM portfolio WHERE Application_Number = "' + AppNo + '";';
            db.query(query,function(err,result,field){
                if(result.length>0){
                    res_con = result[0].research_contri;
                    tea_con = result[0].teaching_contri;
                    pro_ser = result[0].professional_service;
                    por_add = result[0].additional;
                }
                resolve();
            });
        })
    ]).then(() =>{
        res.redirect("/form5f");
    });
});

app.get("/form5f",function(req,res){
    res.render("form5",{AppNo : AppNo,Username:Username,res_con:res_con,tea_con:tea_con,pro_ser:pro_ser,por_add:por_add});
});

app.post("/form5f",function(req,res){
    res_con = req.body.res_con;
    tea_con = req.body.tea_con;
    pro_ser = req.body.pro_ser;
    por_add = req.body.por_add;

    query = 'DELETE FROM portfolio WHERE Application_Number = "' + AppNo + '";';
    db.query(query,function(err,result,fields){});

    query = 'INSERT INTO portfolio VALUES ("' + AppNo + '","' + res_con + '","' + tea_con + '","' + pro_ser + '","' + por_add + '");';
    db.query(query,function(err,result,fields){});

    res.redirect("/form6");
    
});

//<---------------------------------------------------------------------------------->

//Form Page 6 <-------------------------------------------------------------------------->

app.get("/form6",function(req,res){
    res.render("form6",{AppNo:AppNo,Username:Username});
});

app.post("/form6",upload.fields([{name: 'd_pro'},{name: 'd_sig'},{name : 'd_phd'},{name : 'd_pg'},{name : 'd_ug'},{name : 'd_12'},{name : 'd_10'},{name : 'd_add'}]),function(req,res){
    let snn = req.body.snn;
    if(snn == "snn"){
        res.redirect("/form7");
    }
    else res.redirect("/form6");
});

//<---------------------------------------------------------------------------------------->

//Form Page 7 <------------------------------------------------------------------------------->

app.get("/form7",function(req,res){
    res.render("form7",{AppNo:AppNo,Username:Username});
});
app.post("/form7",function(req,res){
    res.redirect("/pdf");
});


// <----------------------------------------------------------------->
app.get("/pdf",function(req,res){
    res.render("pdf",{Username:Username,AppNo:AppNo,F_Name : F_Name,M_Name:M_Name,L_Name:L_Name,DOB:DOB,Gender:Gender,Nationality:Nationality,ID_type:ID_type,
        ID_no:ID_no,Category:Category,Email:Email,Mobile_no:Mobile_no,Add_l1:Add_l1,Add_l2:Add_l2,City:City,State:State,Pincode:Pincode,Department:Department,Position:Position,
        phd_uni:phd_uni,phd_Dept:phd_Dept,phd_sn:phd_sn,phd_dos:phd_dos,phd_yoj:phd_yoj,phd_title:phd_title,
        pg_uni:pg_uni,pg_deg:pg_deg,pg_bra:pg_bra,pg_yoj:pg_yoj,pg_yoc:pg_yoc,pg_dur:pg_dur,pg_per:pg_per,pg_div:pg_div,
        ug_uni:ug_uni,ug_deg:ug_deg,ug_bra:ug_bra,ug_yoj:ug_yoj,ug_yoc:ug_yoc,ug_dur:ug_dur,ug_per:ug_per,ug_div:ug_div,
        add_uni:add_uni,add_deg:add_deg,add_bra:add_bra,add_yoj:add_yoj,add_yoc:add_yoc,add_dur:add_dur,add_per:add_per,add_div:add_div,cnt_ae:cnt_ae,
        EmpHis:EmpHis,ResSup:ResSup,Aw:Aw,Rso:Rso,Eh_Position:Eh_Position,Eh_Organisation:Eh_Organisation,Eh_DOJ:Eh_DOL,Eh_DOL:Eh_DOL,
        Rs_Name:Rs_Name,Rs_DOC:Rs_DOC,Rs_DOS:Rs_DOS,Rs_Degree:Rs_Degree,Rs_Status:Rs_Degree,Rs_Status:Rs_Status,Rs_Title:Rs_Title,Aw_Name:Aw_Name,Aw_Presentor:Aw_Presentor,Aw_Year:Aw_Year,Rso_Name:Rso_Name,Rso_Status:Rso_Status,
        AppNo:AppNo,Username:Username,Pb:Pb,Ps:Ps,Pt:Pt,nij:nij,nic:nic,nnj:nnj,nnc:nnc,n_p:n_p,n_b,n_b,Pb_YOP:Pb_YOP,Pb_author:Pb_author,
        Pb_docid:Pb_docid,Pb_title:Pb_title,Pb_type:Pb_type,Pt_DOF:Pt_DOF,Pt_DOP:Pt_DOP,Pt_inventor:Pt_inventor,Pt_number:Pt_number,Pt_status:Pt_status,Pt_title:Pt_title,
        cnt2:cnt2,cnt3:cnt3,cnt4:cnt4,cnt5:cnt5,cnt6:cnt6,cnt10:cnt10
    
    });
});

app.post("/pdf",function(req,res){
    res.redirect("/")
});



//<---------------------------------------------------------------------------------------------->
app.listen(3000, () => {
    console.log("The app start on http://localhost:3000");
});