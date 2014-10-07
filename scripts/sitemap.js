var sitemap = require('express-sitemap');

/***************************************************** 
 ***                     Sitemap
 *****************************************************/

exports.generateSitemap = function(url) {
    sitemap({
        url: url,
        map: {
            '/': ['get'],
            '/ma-personnalite': ['get'],
            '/mon-reseau-social': ['get'],
            '/projets/knov': ['get'],
            '/projets/js13k': ['get'],
            '/contact/formulaire-de-contact': ['get', 'post'],
            '/contact/formulaire-embauche': ['get', 'post'],
            '/resources/CORREAUD-Curriculum_vitae.pdf': ['get'],
        },
        route: {
            '/': {
                changefreq: 'daily',
                priority: 1.0,
            },
            '/ma-personnalite': {
                changefreq: 'daily',
                priority: 0.8,
            },
            '/mon-reseau-social': {
                changefreq: 'daily',
                priority: 0.9,
            },
            '/projets/knov': {
                changefreq: 'daily',
                priority: 0.7,
            },
            '/projets/js13k': {
                changefreq: 'daily',
                priority: 0.7,
            },
            '/contact/formulaire-de-contact': {
                changefreq: 'daily',
                priority: 0.5,
            },
            '/contact/formulaire-embauche': {
                changefreq: 'daily',
                priority: 0.5,
            },
            '/resources/CORREAUD-Curriculum_vitae.pdf': {
                changefreq: 'daily',
                priority: 0.5,
            },
        },
    }).XMLtoFile();
};
