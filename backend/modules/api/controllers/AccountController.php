<?php

namespace app\modules\api\controllers;

use yii\data\ActiveDataProvider;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\rest\ActiveController;

/**
 * Class AccountController
 *
 * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
 * @package app\modules\api\controllers
 */
class AccountController extends ActiveController
{
    public $modelClass = '\app\models\Account';
//    public $serializer = [
//        'class' => 'yii\rest\Serializer',
//        'collectionEnvelope' => 'Account',
//    ];

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        // Options 2: Remove authenticator, Add Cors and then Add authenticator
        $auth = $behaviors['authenticator'];
        $auth['authMethods'] = [
            HttpBearerAuth::class
        ];
        unset($behaviors['authenticator']);
        $behaviors['cors'] = [
            'class' => Cors::class
        ];
        $behaviors['authenticator'] = $auth;

        return $behaviors;
    }

    // public function actions()
    // {
    //     $actions = parent::actions();
    //     $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

    //     return $actions;
    // }

    // public function prepareDataProvider()
    // {
    //     return new ActiveDataProvider([
    //         'query' => $this->modelClass::find()->andWhere(['user_id' => \Yii::$app->user->id])
    //     ]);
    // }
}
