import React, { Component } from 'react';
import Select from 'react-select';

const options = [
  { value: 18 , label: 'Compétences / Git commit' },
  { value: 84 , label: 'Méthode / User story parfaite / Design' },
  { value: 87 , label: 'Outils / Config XDebug' },
  { value: 66 , label: 'Environnement / Github down' },
  { value: 83 , label: 'Méthode / Temps de build de la CI' },
  { value: 85 , label: 'Méthode / Wording' },
  { value: 86 , label: 'Outils / Config Pretty-pull-request' },
  { value: 2 , label: 'Compétence / React Navigation' },
  { value: 24 , label: 'Compétences / Injection de dépendances Symfony' },
  { value: 53 , label: 'Compétences / Tests fonctionnels Symfony' },
  { value: 1 , label: 'Compétence / Packager' },
  { value: 3 , label: 'Compétence / Redux' },
  { value: 4 , label: 'Compétences / Architecture du projet' },
  { value: 5 , label: 'Compétences / Boucle en PHP' },
  { value: 6 , label: 'Compétences / Clefs de traduction' },
  { value: 7 , label: 'Compétences / Composer' },
  { value: 8 , label: 'Compétences / Conception' },
  { value: 9 , label: 'Compétences / CSS' },
  { value: 10 , label: 'Compétences / Debugger' },
  { value: 11 , label: 'Compétences / Doctrine' },
  { value: 12 , label: 'Compétences / ES6' },
  { value: 13 , label: 'Compétences / Exception' },
  { value: 14 , label: 'Compétences / Fixtures' },
  { value: 15 , label: 'Compétences / Flow' },
  { value: 16 , label: 'Compétences / Formik' },
  { value: 17 , label: 'Compétences / Git' },
  { value: 19 , label: 'Compétences / Git conflits' },
  { value: 20 , label: 'Compétences / Git rebase' },
  { value: 21 , label: 'Compétences / HTML' },
  { value: 22 , label: 'Compétences / IDE' },
  { value: 23 , label: 'Compétences / Immutable' },
  { value: 25 , label: 'Compétences / Intl' },
  { value: 26 , label: 'Compétences / jQuery' },
  { value: 27 , label: 'Compétences / JS' },
  { value: 28 , label: 'Compétences / Kubernetes' },
  { value: 29 , label: 'Compétences / Linting' },
  { value: 30 , label: 'Compétences / Lodash' },
  { value: 31 , label: 'Compétences / Mailer Symfony' },
  { value: 32 , label: 'Compétences / Material-UI' },
  { value: 33 , label: 'Compétences / Migration Doctrine' },
  { value: 34 , label: 'Compétences / Naming' },
  { value: 35 , label: 'Compétences / npm' },
  { value: 36 , label: 'Compétences / NVM' },
  { value: 37 , label: 'Compétences / PDF' },
  { value: 38 , label: 'Compétences / Prettier' },
  { value: 39 , label: 'Compétences / Rabbit MQ' },
  { value: 40 , label: 'Compétences / RabbitMq' },
  { value: 41 , label: 'Compétences / React' },
  { value: 42 , label: 'Compétences / react-intl' },
  { value: 43 , label: 'Compétences / Redux' },
  { value: 44 , label: 'Compétences / Redux Form' },
  { value: 45 , label: 'Compétences / Refactoring' },
  { value: 46 , label: 'Compétences / Regex' },
  { value: 47 , label: 'Compétences / Saga' },
  { value: 48 , label: 'Compétences / Serializer Symfony' },
  { value: 49 , label: 'Compétences / Sonata' },
  { value: 50 , label: 'Compétences / Symfony' },
  { value: 51 , label: 'Compétences / Test unitaire front' },
  { value: 52 , label: 'Compétences / Tests end-to-end' },
  { value: 54 , label: 'Compétences / Tests unitaires Symfony' },
  { value: 55 , label: 'Compétences / Twig' },
  { value: 56 , label: 'Compétences / Vagrant' },
  { value: 57 , label: 'Environment / Provisioning' },
  { value: 58 , label: 'Environnement / BDD de tests' },
  { value: 59 , label: 'Environnement / Bruit' },
  { value: 60 , label: 'Environnement / Build' },
  { value: 61 , label: 'Environnement / CI' },
  { value: 62 , label: 'Environnement / Device' },
  { value: 63 , label: 'Environnement / Docker compose' },
  { value: 64 , label: 'Environnement / Données locales out of date' },
  { value: 65 , label: 'Environnement / Données staging out of date' },
  { value: 67 , label: 'Environnement / Installation' },
  { value: 68 , label: 'Environnement / Performance' },
  { value: 69 , label: 'Environnement / Pipeline' },
  { value: 70 , label: 'Méthode / Assets' },
  { value: 71 , label: 'Méthode / Atelier technique ' },
  { value: 72 , label: 'Méthode / Caspr' },
  { value: 73 , label: 'Méthode / CI rouge' },
  { value: 74 , label: 'Méthode / Conception' },
  { value: 75 , label: 'Methode / Conecption pas challengée ' },
  { value: 76 , label: 'Méthode / Déploiement trop long' },
  { value: 77 , label: 'Méthode / Maquette' },
  { value: 78 , label: 'Méthode / Mauvaise stratégie technique' },
  { value: 79 , label: 'Méthode / Relecture PR' },
  { value: 80 , label: 'Méthode / Start ticket' },
  { value: 81 , label: 'Méthode / Stratégie incomplète' },
  { value: 82 , label: 'Méthode / Stratégie technique' },
  { value: 88 , label: 'Outils / Flow' },
  { value: 89 , label: 'Outils / IDE' },
  { value: 90 , label: 'Outils / Librairie design' },
  { value: 91 , label: 'Outils / Linter IDE' },
  { value: 92 , label: 'Outils / npm' },
  { value: 93 , label: 'Outils / Packager' },
  { value: 94 , label: 'Outils / PHP CS Fixer' },
  { value: 95 , label: 'Outils / Vagrant' },
  { value: 96 , label: 'Outils / Webpack' },
];

class RootCauseCategoryAutocomplete extends Component {
  state = {
    selectedOption: null,
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  }

  render() {
    return (
      <Select
        value={this.state.selectedOption}
        onChange={this.handleChange}
        options={options}
        placeholder={'Choose the root cause category'}
      />
    );
  }
}

export default RootCauseCategoryAutocomplete;
