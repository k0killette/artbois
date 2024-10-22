-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db.3wa.io
-- Généré le : lun. 21 oct. 2024 à 16:32
-- Version du serveur :  5.7.33-0ubuntu0.18.04.1-log
-- Version de PHP : 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `jalouneixcamille_artbois`
--

-- --------------------------------------------------------

--
-- Structure de la table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `status_id`, `created_at`) VALUES
(1, 'L\'atelier - Création de deux tables de chevet en chêne', 'Ces dernières semaines, l\'équipe s\'est attelée à la création de deux tables de chevet pour un client particulier. \r\nCelles-ci ont été réalisées en chêne, avec des pieds délicatement incurvés. \r\nChaque table présent un tiroir et une porte battante, avec des poignées rondes en laiton.', NULL, '2024-08-23 13:55:13'),
(2, 'Ebénisterie - Devenir ébéniste, quelle formation ?', 'Si l’ébéniste doit maîtriser les bases de la menuiserie, il s’en distingue par sa production et ses travaux sur mesure. Pour atteindre ce niveau, différentes formations sont possibles, du CAP à bac+2, en préparant :\r\n\r\n • CAP ébéniste,\r\n • CAP arts du bois option marqueteur ;\r\n • CAP dessinateur pour l’ameublement ;\r\n • BMA (brevet des métiers d’art) ébéniste ;\r\n • BTM (brevet technique des métiers) ébéniste ;\r\n • DMA arts de l’habitat, options décors et mobilier spécialité ébénisterie ou restauration de mobilier ;\r\n • BTMS (brevet technique des métiers supérieurs) ébéniste options Restauration de meubles anciens, conception et fabrication de mobilier contemporain (accessible après BTM Ébéniste, BMA ébéniste, Bac Pro ébénisterie + 3 ans d’expérience, CAP ébéniste + 5 ans d’expérience).', 1, '2024-09-02 06:58:36'),
(4, 'L\'atelier - L\'équipe se renforce avec un nouvel apprenti', 'Lundi, nous avons eu le plaisir d\'accueillir Geoffrey dans l\'équipe. A 25 ans il effectue une reconversion professionnelle, ayant travaillé comme conseiller commercial jusqu\'alors. \r\nGeoffrey nous rejoint pour deux ans en alternance, dans le cadre de la préparation de son Brevet des Métiers d\'Art avec le Lycée des Métiers d\'Art Saint-Quentin. \r\n\r\nBienvenue à lui !', 1, '2024-09-23 08:39:02'),
(6, 'Ebénisterie - Quelles essences de bois utilise un ébéniste ?', 'Le choix du bois est une étape cruciale pour l’artisan et tout dépend de ses affinités ainsi que du projet final. Par exemple, le chêne occupe une place très importante dans la profession. Bien que très dur, il reste très facile à travailler. Ce qui induit des pièces de bois finement sculptées mais d’une incroyable solidité. A contrario, le tilleul et le noyer sont considérés comme des bois gras. Ce type de bois est très malléable et facile à sculpter mais moins robuste. C’est pourquoi il se destine généralement aux travaux de sculpture artistique. Pour des produits de luxe, l’acajou est l’heureux élu car son essence et sa couleur sont d’un raffinement inégalable.', 1, '2024-10-01 13:51:22'),
(8, 'Actu', 'Je suis une nouvelle actu', 1, '2024-10-03 07:40:12');

-- --------------------------------------------------------

--
-- Structure de la table `news_images`
--

CREATE TABLE `news_images` (
  `id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `news_images`
--

INSERT INTO `news_images` (`id`, `news_id`, `image_url`, `alt`) VALUES
(3, 1, '/public/news_images/52ac2506-f9a3-4963-a682-fec0951e0d6a.jpeg', 'table de chevet en chêne'),
(4, 1, '/public/news_images/e4187778-df6b-44c8-8e53-4ea828a9997d.jpeg', 'table de chevet en chêne'),
(5, 1, '/public/news_images/8ee89d18-1011-4e41-8e53-6e26db79f0df.jpeg', 'table de chevet en chêne'),
(6, 4, '/public/news_images/3da72751-18fb-4b08-86d0-e4e468b04bbe.png', 'nouveau collaborateur en alternance'),
(7, 6, '/public/news_images/c1e9bad3-5e6f-4162-9fa8-fb23553b8b55.jpg', 'nuancier essences de bois'),
(8, 2, '/public/news_images/424ee227-289b-44e4-9101-8083112c5648.jpg', 'formation alternance ébéniste');

-- --------------------------------------------------------

--
-- Structure de la table `news_statuses`
--

CREATE TABLE `news_statuses` (
  `id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `news_statuses`
--

INSERT INTO `news_statuses` (`id`, `status_name`) VALUES
(1, 'En cours'),
(2, 'Modifié'),
(3, 'Annulé'),
(4, 'Terminé');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` float NOT NULL,
  `shipping_cost` float NOT NULL,
  `total_weight` int(11) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_id` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `created_at`, `user_id`, `total_amount`, `shipping_cost`, `total_weight`, `updated_at`, `status_id`) VALUES
(1, '2024-08-23 13:27:12', 6, 158.8, 8.8, 2500, '2024-09-26 13:33:37', 3),
(20, '2024-09-24 11:28:47', 6, 104.99, 4.99, 250, '2024-09-26 13:33:50', 1);

-- --------------------------------------------------------

--
-- Structure de la table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `product_price` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `product_price`) VALUES
(1, 1, 1, 1, 25),
(2, 1, 3, 3, 25),
(3, 1, 2, 1, 50),
(4, 20, 1, 2, 25),
(5, 20, 2, 1, 50),
(6, 1, 1, 2, 50),
(7, 1, 3, 1, 100);

-- --------------------------------------------------------

--
-- Structure de la table `order_statuses`
--

CREATE TABLE `order_statuses` (
  `id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `order_statuses`
--

INSERT INTO `order_statuses` (`id`, `status_name`) VALUES
(1, 'Payée'),
(2, 'Expédiée'),
(3, 'Livrée'),
(4, 'Annulée'),
(5, 'En attente de paiement');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '1',
  `price` float NOT NULL,
  `length` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category_id`, `stock`, `price`, `length`, `width`, `height`, `weight`, `created_at`) VALUES
(1, 'Lunettes de soleil', 'Ces lunettes sont fabriquées avec le même procédé qu’une planche de skateboard. De multiples épaisseurs de bois d’érable coloré sont collées pour former une monture solide et résistante. Nous avons adapté cette technique de fabrication pour rendre ces lunettes ultra-légères, confortables et fun. Nous utilisons uniquement des verres polarisés, protégeant 100% des UV400. Parfait pour flâner à la plage ou en montage ! Les verres polarisés neutralisent les reflets, permettent une vision d’une pure clarté en améliorant les contrastes.', 3, 3, 25, 0, 0, 0, 25, '2024-08-23 13:03:46'),
(2, 'Boite à bijoux', 'Ce coffret en bois présente une élégance simple et raffinée, ainsi que des lignes classiques, sobres et contemporaines qui en font un gardien parfait pour vos ensembles de bijoux. Vos colliers, bagues et boucles d\'oreilles résideront ensemble dans ce coffret, chacun séparé avec soin pour éviter enchevêtrements et éventuels chocs.', 3, 2, 50, 0, 0, 0, 200, '2024-08-23 13:07:03'),
(3, 'Planche à découper', 'Trio de Planches à découper ', 3, 1, 25, 0, 0, 0, 750, '2024-08-23 13:07:03'),
(4, 'Nœud papillon', 'Nœud papillon en chêne', 3, 0, 89, 0, 0, 0, 35, '2024-08-23 13:07:03'),
(5, 'Horloge marqueterie de paille', 'Horloge réalisée en marqueterie de paille, avec mélange de chêne et de noyer. \r\nIncrustations et aiguilles en laiton doré. ', 2, 1, 15, 500, 10, 500, 300, '2024-09-21 15:17:44');

-- --------------------------------------------------------

--
-- Structure de la table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`) VALUES
(1, 'Mobilier'),
(2, 'Décoration'),
(3, 'Accessoires'),
(4, 'Art de la table');

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt`) VALUES
(3, 1, '/public/product_images/245b7cab-ebac-4473-8406-c0ae66a2bbce.jpg', 'Nouvelle description de l\'image'),
(5, 4, '/public/product_images/42278c65-2826-4c20-935e-bd843b0c3954.webp', 'noeud papillon chêne'),
(6, 3, '/public/product_images/79add71b-22f5-4b8f-b2fd-789120f08a6b.png', 'planches à découper en bois'),
(7, 5, '/public/product_images/b0faec9a-deea-4ecb-9a54-dac1205a8eb1.png', 'horloge en bois détails chrome'),
(8, 2, '/public/product_images/2c10eb19-203d-48aa-a1bb-d66a3feb17b2.jpg', 'coffret bijoux bois et laiton avec compartiments et serrure '),
(9, 2, '/public/product_images/d40f4561-be85-49c2-bab5-41a9db350c1b.webp', 'coffret bijoux bois et laiton avec compartiments et serrure '),
(10, 2, '/public/product_images/8a17797a-2421-4e64-b303-a8c5b495b89c.webp', 'coffret bijoux bois et laiton avec compartiments et serrure '),
(11, 2, '/public/product_images/6187cec5-c228-48b6-b179-4d8cdbe154b5.webp', 'coffret bijoux bois et laiton avec compartiments et serrure ');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` char(60) NOT NULL,
  `address_1` varchar(255) NOT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `zip` varchar(10) NOT NULL,
  `city` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  `terms_accepted` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `address_1`, `address_2`, `zip`, `city`, `phone`, `role`, `terms_accepted`, `created_at`) VALUES
(4, 'Admin', 'Istrateur', 'administr@teur.com', '$2a$10$XMDp8psAoy1ZMXYpW93TyeTWzAC3tfcElrCtKqHvRZlj7HXLBIJ32', 'address1', 'address2', '0111001010', 'AdminCity', '0123456789', 'admin', 0, '2024-09-19 06:39:50'),
(6, 'Azerty', 'Qwerty', 'azerty@qwerty.com', '$2a$10$K7QrF8x2FQQU8kdYSL8mbOXGJEtU8Mv5hzJDDdlJ/wskvhmcKdNz6', 'address_1', 'address_2', '11111', 'azerty', '0123456789', 'user', 0, '2024-09-26 11:31:40'),
(7, 'Simba', 'LeChat', 'simba.lechat@maitre-de-lunivers.com', '$2a$10$OVwtBqlS8qf9gNswJAIDD.ivv3U9Yu5o12N6sN2JAiiMafTbCv35y', 'Miaou Street', NULL, '11111', 'CroquetteLand', '0123456789', 'user', 0, '2024-09-26 11:35:52'),
(8, 'Camille', 'Jalouneix', 'jalouneix.camille@3wa.io', '$2a$10$zpqKqNQ6ZlpNSU/tYXqW.upi0df1Rk5HwgjkapSn9C2HLYxuc5uPa', 'address', NULL, '00000', 'Full Stack', '0123456789', 'user', 0, '2024-09-26 11:37:33'),
(9, 'Test', 'BDD', 'test@bdd.com', 'Password123!', 'address_1', 'address_2', '12345', 'Test City', '0123456789', 'user', 1, '2024-10-05 12:23:40'),
(10, 'Test', 'Sans Captcha', 'test@gmail.com', '$2a$10$xiKCYGKSSC0SBm5b5Q5/F.4NAFTuENLfnfkOsr3V92mIv/OGhfQni', 'Google Street', '', '00000', 'Google City', '0123456789', 'user', 1, '2024-10-05 13:03:28'),
(11, 'Test', 'Avec Captcha', 'test@captcha.com', '$2a$10$LD94QwV0i3.pjnsSSLtpJevIAl7bkQwAvnL4WUOqjMfdNxJUOJEra', 'Google Street', '', '00000', 'Google City', '0123456789', 'user', 1, '2024-10-05 13:11:17'),
(12, 'Test', 'Avec Captcha', 'test@avec-captcha.com', '$2a$10$M8ZiQsE5jESrh6QBk6BX8uYuIyRrXbN0JHHAq5QsOrp.5HD6vDxr.', 'Google Street', '', '00000', 'Google City', '0123456789', 'user', 1, '2024-10-05 13:32:09'),
(13, 'Alan', 'Bocquillon', 'alan@bocquillon.com', '$2a$10$RcGUh42SmavpdHTygMJnMuCw/OZpr7WtKo8UAKbnUXcIW2bRVOLmS', 'Atelier Art&Bois', '', '51100', 'Reims', '0123456789', 'user', 1, '2024-10-05 13:58:54'),
(14, 'Cecilia', 'Paez', 'ceciliapaez5@hotmail.com', '$2a$10$7YUWq172JLXbnuz1AXVzH.UUX6J944eK4Ai3ZR3vs3L8Tgoeo/Dty', '19 rue Saint Pantaléon', '', '24290', 'Sergeac', '0782746474', 'user', 1, '2024-10-17 11:24:05'),
(15, 'Alan', 'Bocquillon', 'alan.boc@hotmail.fr', '$2a$10$GS0iCiSfYjzCSwEu5d.vA.Eenvg61ckzDDOhyI3b.HD4ZKQhpsvNu', '3 rue Alain Colas', '', '51450', 'Betheny', '0646285816', 'user', 1, '2024-10-17 17:49:10');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status_id` (`status_id`);

--
-- Index pour la table `news_images`
--
ALTER TABLE `news_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `news_id` (`news_id`);

--
-- Index pour la table `news_statuses`
--
ALTER TABLE `news_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`user_id`),
  ADD KEY `idx_status_id` (`status_id`);

--
-- Index pour la table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_id` (`order_id`),
  ADD KEY `products_id` (`product_id`);

--
-- Index pour la table `order_statuses`
--
ALTER TABLE `order_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_id` (`category_id`),
  ADD KEY `idx_categories_id` (`category_id`);

--
-- Index pour la table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `news_images`
--
ALTER TABLE `news_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `news_statuses`
--
ALTER TABLE `news_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `order_statuses`
--
ALTER TABLE `order_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `news_statuses` (`id`);

--
-- Contraintes pour la table `news_images`
--
ALTER TABLE `news_images`
  ADD CONSTRAINT `news_images_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `order_statuses` (`id`);

--
-- Contraintes pour la table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`);

--
-- Contraintes pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
