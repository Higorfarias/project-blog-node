const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) =>{
    res.render('admin/index')
})

router.get('/posts', (req, res) =>{
    res.send("Pagina de posts")
})

router.get('/categorias', (req,res) =>{
    Categoria.find().sort({date:'desc'}).then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req,res) =>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req,res) => {
    
    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.name.length < 2){
        erros.push({texto: "Nome da categoria muito curto"})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias',{erros: erros})
    }else{
        const novaCategoria = {
            name: req.body.name,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("succes_msg", "Categoria criada com sucesso")
            res.redirect("/admin/categorias")
            console.log("Categoria salva com sucesso!")
        }).catch((err) =>{
            req.flash("error.msg", "Ocorreu um erro ao cadastrar")
            res.redirect('/admin')
        })
    }
    })

    router.get('/categorias/edit/:id', (req, res) => {
        res.render('admin/editcategoria')
    })
    
    

    
    

module.exports = router