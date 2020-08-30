import Pages from './Pages/*.js'
import Page from './Page'
import Poster from './Poster'

var header = document.querySelector( '#header' )
var footer = document.querySelector( '#footer' )

if( ! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.querySelector( '#desktopwarn' ).classList.add( 'active' )
}

if (window.location.href.indexOf('localhost') > -1) {
    window.inLocal = true
    window.preventSave = true
    document.querySelector( '#desktopwarn' ).classList.remove( 'active' )
}


var lang = 'es'
var userLang = navigator.language || navigator.userLanguage
if( userLang.split('-')[ 0 ] == 'en' ) lang = 'en'
document.body.classList.add( 'l-' + lang )


var strings = {
    main : {
        es : 'Hola!',
        en : 'Hello!'
    },
    intro2 : {
        es : '1/6 &nbsp; El mensaje',
        en : '1/6 &nbsp; The message'
    },
    writer : {
        es : '2/6 &nbsp;  Redacción',
        en : '2/6 &nbsp;  Writing'
    },
    font : {
        es : '3/6 &nbsp; Tipografía',
        en : '3/6 &nbsp; Font'
    },
    size : {
        es : '4/6 &nbsp; Tamaño',
        en : '4/6 &nbsp;  Size'
    },
    align : {
        es : '5/6 &nbsp; Alinear',
        en : '5/6 &nbsp;  Alignment'
    },
    color : {
        es : '6/6 &nbsp; Color',
        en : '6/6 &nbsp;  Color'
    },
    preview : {
        es : 'Tu póster',
        en : 'Your poster'
    },
    save2 : {
        es : '¡Enviado!',
        en : 'Sent!'
    },
    news2 : {
        es : 'News',
        en : 'News'
    },
    gallery : {
        es : 'Galería',
        en : 'Gallery'
    },
    about : {
        es : 'About',
        en : 'About'
    },
    manifesto : {
        es : 'Manifesto',
        en : 'Manifesto'
    },
    contacto : {
        es : 'Contacto',
        en : 'Contact'
    },
    faq : {
        es : 'FAQs',
        en : 'FAQs'
    },
    credits : {
        es : 'Créditos',
        en : 'Credits'
    },
    placeholder : {
        es : 'Escribe aquí',
        en : 'Write here'
    }
}

document.querySelectorAll('textarea.poster').forEach( p => p.placeholder = strings.placeholder[ lang ] )


class Flow{ 
    constructor( page = 0 ){
        this.node = document.querySelector( '#mainFlow' )
        this.page = page
        this.pages = []

        var pages = this.node.querySelectorAll( '.page' )
        Object.values( pages ).forEach( p => {
            var pageObject
            if( p.dataset.class ) pageObject = new Pages[ p.dataset.class ].default( p )
            else pageObject = new Page( p )
            pageObject.on( 'updateFlow', ( e, f ) => this.update( e ) )
            this.pages.push( pageObject )
        })

        if (window.location.href.indexOf('localhost') > -1) this.navigate( 0 )
        else this.navigate( 0 )
    }

    update( e ){
        switch( e.action ) {
            case 'copyUpdate':
                poster.updateCopy( e.data )
                break;
            case 'sizeUpdate':
                poster.updateSize( e.data )
                break;
            case 'fontUpdate':
                poster.updateFont( e.data )
                break;
            case 'alignUpdate':
                poster.updateAlign( e.data )
                break;
            case 'colorUpdate':
                poster.updateColor( e.data )
                break;
            case 'posterExport':
                poster.posterExport( e.data, e.meta )
                break;
            case 'navigateForward':
                this.navigate( ++this.page )
                break;
                
            default: console.log( 'no idea ')
        }
    }

    navigate( page ){
        this.page = Math.max( 0, Math.min( page, this.pages.length - 1 ) )
        
        
        if( this.page == 0 ) footer.dataset.navitype = 'first'
        if( this.page > 0 && this.page < this.pages.length - 1 ) footer.dataset.navitype = 'middle'
        if( this.page == this.pages.length - 1 ) footer.dataset.navitype = 'last'

        var currentPage = this.pages[ this.page ].node
        currentPage.classList.add( 'active' )
        currentPage.classList.remove( 'left' )
        currentPage.classList.remove( 'right' )

        this.pages[ this.page ].onEnterPage()
        // if( this.page > 0 ) this.pages[ this.page - 1 ].onLeavePage()

        for( var i = 0 ; i < this.page ; i++ ){
            this.pages[ i ].node.classList.remove( 'active' )
            this.pages[ i ].node.classList.add( 'left' )
        }
        
        for( var i = this.page + 1 ; i < this.pages.length ; i++ ){
            this.pages[ i ].node.classList.remove( 'active' )
            this.pages[ i ].node.classList.add( 'right' )
        }

        var headerTitle = document.querySelector( '#pageTitle' )
        headerTitle.classList.toggle( 'main', this.page == 0 ) 
        headerTitle.innerHTML = strings[ currentPage.dataset.pid ][ lang ]
    }
}

class Menu{
    constructor(){
        this.node = document.querySelector( '#menu' )
        this.pages = []
        this.active = 'main'
        var pages = this.node.querySelectorAll( '.page' )
        Object.values( pages ).forEach( p => {
            var pageObject
            if( p.dataset.class ) pageObject = new Pages[ p.dataset.class ].default( p )
            else pageObject = new Page( p )
            this.pages.push( pageObject )
        })

        Object.values( document.querySelectorAll( '.menuItem' ) ).forEach( m => {
            m.addEventListener( 'click', ( e ) => {
                this.node.querySelector( '.page[data-pid=menu]' ).classList.add( 'left' )
                this.node.querySelector( '.page[data-pid=menu]' ).classList.remove( 'active' )
                this.node.querySelector( '.page[data-pid=' + e.target.dataset.target + ']' ).classList.remove( 'right' )
                this.node.querySelector( '.page[data-pid=' + e.target.dataset.target + ']' ).classList.add( 'active' )
                this.active = e.target.dataset.target
                var headerTitle = document.querySelector( '#pageTitle' )

                headerTitle.innerHTML = strings[ e.target.dataset.target ][ lang ]
            } )
        } ) 
    }

    back( ){
        if( this.active !== 'main' ) {
            this.node.querySelector( '.active' ).classList.add( 'right' )
            this.node.querySelector( '.active' ).classList.remove( 'active' )
            this.node.querySelector( '.page[data-pid=menu]' ).classList.remove( 'left' )
            this.node.querySelector( '.page[data-pid=menu]' ).classList.add( 'active' )
            var headerTitle = document.querySelector( '#pageTitle' )
            headerTitle.innerHTML = 'Menu'
            this.active = 'main'
        } else {
            this.close()
        }
        
    }

    open(){
        
        footer.dataset.navitype = 'inMenu'
        header.classList.add( 'inMenu' )

        var headerTitle = document.querySelector( '#pageTitle' )
        headerTitle.classList.remove( 'main' )
        headerTitle.innerHTML = 'Menu'
    }

    close(){

        header.classList.remove( 'inMenu' )

        this.node.classList.remove( 'active' )
        flow.navigate( flow.page )

        this.pages.forEach( p => {
            p.node.classList.remove( 'active' ) 
            p.node.classList.add( 'right' ) 
        })
        this.pages[ 0 ].node.classList.add( 'active' )
        this.pages[ 0 ].node.classList.remove( 'left', 'right' )
    }

    toggleActive( ){
        this.node.classList.toggle( 'active' )
        if( this.node.classList.contains( 'active' ) ) this.open()
        else this.close()
    }
}

var poster = new Poster()
var flow = new Flow()
var menu = new Menu()

document.querySelector( '.arrow.right' ).addEventListener( 'click', ( ) => flow.navigate( ++flow.page ) )
document.querySelector( '.arrow.left' ).addEventListener( 'click', ( ) => flow.navigate( --flow.page ) )
document.querySelector( '.arrow.menu' ).addEventListener( 'click', ( ) => menu.back( ) )
document.querySelector( '#menuBut' ).addEventListener( 'click', ( ) => menu.toggleActive() )