import Page from './../Page'

class Writer extends Page{
    constructor( p ){
        super( p )
        this.textarea = this.node.querySelector( 'textarea' )
        this.textarea.addEventListener( 'change', ( e ) => this.input( e ) )
        this.textarea.addEventListener( 'input', ( e ) => this.input( e ) )
    }

    updateBox(){
        setTimeout( () => { 
            this.textarea.style.cssText = 'height:auto; padding:0'
            this.textarea.style.cssText = 'height:' + this.textarea.scrollHeight + 'px';
        } , 1 )
    }

    onEnterPage(){
        if( window.preventSave ) return
        if( !this.textarea.value.length ) document.querySelector( '#footer' ).dataset.navitype = 'blockNext'
    }

    input( e ){
        this.emit( 'updateFlow' , { action : 'copyUpdate', data : this.textarea.value } )
        if( !this.textarea.value.length ) document.querySelector( '#footer' ).dataset.navitype = 'blockNext'
        else document.querySelector( '#footer' ).dataset.navitype = 'middle'
    }
}

export { Writer as default }