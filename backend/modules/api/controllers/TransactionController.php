<?php

namespace app\modules\api\controllers;

use yii\data\ActiveDataProvider;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\rest\ActiveController;

/**
 * Class TransactionController
 *
 * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
 * @package app\modules\api\controllers
 */
class TransactionController extends ActiveController
{
    public $modelClass = '\app\models\Transaction';

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
    //         'query' => $this->modelClass::find()->andWhere(['account_id' => \Yii::$app->user->id])
    //     ]);
    // }
}
