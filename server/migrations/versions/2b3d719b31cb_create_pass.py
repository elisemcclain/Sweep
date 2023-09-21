"""Create pass

Revision ID: 2b3d719b31cb
Revises: cdb6015c6a63
Create Date: 2023-09-21 09:51:04.783690

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b3d719b31cb'
down_revision = 'cdb6015c6a63'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.String(length=128), nullable=True))
        batch_op.drop_column('_password_hash')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('_password_hash', sa.VARCHAR(length=128), nullable=True))
        batch_op.drop_column('password_hash')

    # ### end Alembic commands ###
