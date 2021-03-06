<?php

use yii\db\Migration;

/**
 * Class m211117_073014_seed_items_table
 */
class m211117_073014_seed_items_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->insertFakeItems();
    }

    private function insertFakeItems()
    {
        $faker = \Faker\Factory::create();
        for ($i = 0; $i < 8; $i++) {
            $this->insert(
                'items',
                [
                    'account_id'    => 1,
                    'name'          => $faker->realText(30),
                    'description'   => $faker->paragraph(3),
                    'open_bid'      => ((int)$faker->randomNumber(3, true)) * 10000,
                    'closing_time'  => 1639638848,
                    'fundraising'   => (int)$faker->randomElement([0,1]),
                    'is_cancelled'  => 0,
                    'event'         => '-',
                    'location'      => $faker->city,
                    'bid_ratio'     => ((int)$faker->randomNumber(3)) * 1000,
                    'created_at'    => time(), 
                    'updated_at'    => time()
                ]
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m211117_073014_seed_items_table cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m211117_073014_seed_items_table cannot be reverted.\n";

        return false;
    }
    */
}
